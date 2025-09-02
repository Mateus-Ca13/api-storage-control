"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.logoutUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
const user_1 = require("../types/user");
exports.registerUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    username: zod_1.z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
    role: zod_1.z.enum(user_1.UserRoleTuple),
    email: zod_1.z.email("Email inválido"),
    password: zod_1.z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: zod_1.z.string().min(6, "Confirmação de senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.email("Email inválido"),
    password: zod_1.z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});
exports.logoutUserSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token é obrigatório"),
});
exports.refreshTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token é obrigatório"),
});
