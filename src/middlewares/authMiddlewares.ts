import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { sendResponse } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      username?: string;
      email?: string;
      userRole?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendResponse(res, null, 'Token não fornecido', false, 401);
  }

  const [, token] = authHeader.split(" "); // Bearer <token>

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.userId = payload.id;
    req.username = payload.username;
    req.email = payload.email;
    req.userRole = payload.role;

    next();
    
  } catch (err) {
    return sendResponse(res, null, 'Token inválido', false, 401);
  }
};

