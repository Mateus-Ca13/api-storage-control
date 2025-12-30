import { Request, Response } from 'express';
import { loginUserSchema } from '../schemas/authSchemas';
import { loginUserService, logoutUserService, refreshTokenService } from '../services/authServices';
import { sendErrorResponse, sendResponse } from '../utils/response';
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserLoginInput } from '../types/user';


export const loginUserController = async (req: Request, res: Response) => {
    try {
        const userCredentials: UserLoginInput = loginUserSchema.parse(req.body);
        const { accessToken, refreshToken, userInfo } = await loginUserService(userCredentials.username, userCredentials.password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
            path: "/api/v1/auth",
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutos
            path: "/",
        });
        
        sendResponse(res, userInfo, 'Usuário autenticado com sucesso', true, 200);

    }catch (error: unknown) {
        sendErrorResponse(res, error, 500);
    }
};

export const logoutUserController = async (req: Request, res: Response) => {
    
    const refreshToken = req.cookies?.refreshToken; 

    if(!refreshToken) {
        return sendErrorResponse(res, 'Acesso negado. Refresh Token não fornecido.', 401);
    }

    try {
        const decoded = jwt.verify(
            refreshToken, 
            process.env.JWT_REFRESH_TOKEN_SECRET as string
        ) as JwtPayload & { jti: string }; 
        
        const result = await logoutUserService(decoded.jti);

        // Limpar os Cookies do lado do cliente
        res.clearCookie("refreshToken", { 
        path: "/api/v1/auth",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
        }
        );
        res.clearCookie("accessToken", { 
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
        });
        sendResponse(res, null, result.message, true, 200);

     }catch (error: unknown) {
        res.clearCookie("refreshToken", { path: "/api/v1/auth" });
        res.clearCookie("accessToken", { path: "/" });
        sendErrorResponse(res, error, 400, 'Sessão inválida ou expirada. Cookies limpos.');
    }
};

export const refreshTokenController = async (req: Request, res: Response) => {

    const refreshToken = req.cookies?.refreshToken; 
    
    try {
        if (!refreshToken) {
            throw new Error('Acesso negado. Refresh Token não fornecido.');
        }

        const decoded = jwt.verify(
            refreshToken, 
            process.env.JWT_REFRESH_TOKEN_SECRET as string
        ) as JwtPayload & { id: number, jti: string, username: string, email: string, role: string };

        const { accessToken, refreshToken: newRefreshToken } = await refreshTokenService(decoded.jti);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
            path: "/api/v1/auth",
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutos
            path: "/",
        });

        sendResponse(res, null, 'Token atualizado com sucesso', true, 200);

    }catch (error: unknown) {
        res.clearCookie("refreshToken", { path: "/api/v1/auth" });
        res.clearCookie("accessToken", { path: "/" });
        sendErrorResponse(res, error, 500);
    }
};