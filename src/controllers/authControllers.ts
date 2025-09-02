import { Request, Response } from 'express';
import { loginUserSchema, registerUserSchema } from '../schemas/authSchemas';
import { loginUserService, logoutUserService, refreshTokenService, registerUserService } from '../services/authServices';
import { sendErrorResponse, sendResponse } from '../utils/response';
import z from 'zod';
import { UserCreateInput, UserLoginInput } from '../types/user';


export const registerUserController = async (req: Request, res: Response) => {
    try {
        const {confirmPassword, ...userDataWithoutConfirm} = registerUserSchema.parse(req.body.userData);
        const userData: UserCreateInput = userDataWithoutConfirm;
        const returnUser = await registerUserService(userData) ;
        sendResponse(res, returnUser, 'Usuário registrado com sucesso', true, 201);
        
    }catch (error: unknown) {
        sendErrorResponse(res, error, 400);
    }
};

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const userCredentials: UserLoginInput = loginUserSchema.parse(req.body.userData);
        const { accessToken, refreshToken } = await loginUserService(userCredentials.email, userCredentials.password);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        });
        sendResponse(res, {accessToken: accessToken}, 'Usuário autenticado com sucesso', true, 200);

    }catch (error: unknown) {
        sendErrorResponse(res, error, 400);
    }
};

export const logoutUserController = async (req: Request, res: Response) => {

    try {
        const refreshToken = req.body.refreshToken;
        if(!refreshToken) sendResponse(res, null, 'Token de refresh não fornecido', false, 400);

        const result = await logoutUserService(refreshToken);
        sendResponse(res, null, result.message, false, 400);

     }catch (error: unknown) {
        sendErrorResponse(res, error, 400);
    }
};

export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        const newAccessToken = refreshTokenService(refreshToken);
        sendResponse(res, newAccessToken, 'Token renovado com sucesso', true, 200);
    }catch (error: unknown) {
        sendErrorResponse(res, error, 400);
    }
};