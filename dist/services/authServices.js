"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserService = exports.registerUserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const registerUserService = async (userData) => {
    const existingUser = await prismaClient_1.default.user.findFirst({
        where: {
            OR: [
                { email: userData.email },
                { username: userData.username },
            ],
        },
    });
    if (existingUser) {
        throw new Error('Usuário já existe!');
    }
    const passwordHash = bcryptjs_1.default.hashSync(userData.password, 10);
    const formattedUserData = { ...userData, password: passwordHash, createdAt: new Date() };
    const newUser = await prismaClient_1.default.user.create({
        data: formattedUserData
    });
    if (!newUser) {
        throw new Error('Error ao criar usuário');
    }
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};
exports.registerUserService = registerUserService;
const loginUserService = async (email, password) => {
    const user = await prismaClient_1.default.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error('Credenciais inválidas');
    }
    const isPasswordValid = bcryptjs_1.default.compareSync(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
};
exports.loginUserService = loginUserService;
