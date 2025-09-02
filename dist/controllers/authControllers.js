"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = exports.logoutUserController = exports.loginUserController = exports.registerUserController = void 0;
const authSchemas_1 = require("../schemas/authSchemas");
const authServices_1 = require("../services/authServices");
const response_1 = require("../utils/response");
const registerUserController = async (req, res) => {
    try {
        const userData = authSchemas_1.registerUserSchema.parse(req.body);
        const returnUser = await (0, authServices_1.registerUserService)(userData);
        (0, response_1.sendResponse)(res, returnUser, 'Usuário registrado com sucesso', true, 201);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, null, error.message, false, 400);
    }
};
exports.registerUserController = registerUserController;
const loginUserController = async (req, res) => {
    try {
        const userCredentials = authSchemas_1.loginUserSchema.parse(req.body);
        const returnJwtToken = await (0, authServices_1.loginUserService)(userCredentials.email, userCredentials.password);
        (0, response_1.sendResponse)(res, returnJwtToken, 'Usuário autenticado com sucesso', true, 200);
    }
    catch (error) {
        (0, response_1.sendResponse)(res, null, error.message, false, 400);
    }
};
exports.loginUserController = loginUserController;
const logoutUserController = async (req, res) => {
    res.send('Controller C');
};
exports.logoutUserController = logoutUserController;
const refreshTokenController = async (req, res) => {
    res.send('Controller D');
};
exports.refreshTokenController = refreshTokenController;
