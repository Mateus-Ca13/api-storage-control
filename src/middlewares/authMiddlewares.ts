import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { iUserPayload, UserRoleType } from '../types/user';
import { sendErrorResponse } from '../utils/response';

export interface IAuthRequest extends Request {
    user?: iUserPayload; 
}

export const authMiddleware = (req: IAuthRequest, res: Response, next: NextFunction) => {

    let token = req.cookies.accessToken;

    if (!token) {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return sendErrorResponse(res, null, 401, 'Acesso negado. Token não fornecido.');
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET as string 
        ) as JwtPayload & iUserPayload; 

        req.user = decoded; // Define informações de usuário para uso no roleMiddleware 

        next();
        
    } catch (error: any) {

        console.error("Falha na autenticação JWT:", error.message);
        return sendErrorResponse(res, 'Token de acesso inválido ou expirado.', 401);
    }
};

export const roleMiddleware = (allowedRoles: UserRoleType[]) => {
    
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
        
        const userRole = req.user?.role as UserRoleType | undefined;
        
        if (!userRole) {
            return sendErrorResponse(res, 'Erro de autenticação interna: Role do usuário não encontrada.', 500);
        }
        
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            return sendErrorResponse(res, null, 403, 'Acesso Proibido. Você não possui a permissão necessária.');
        }
    };
};