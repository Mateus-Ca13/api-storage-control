import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import prisma from '../lib/prismaClient';
import { iUser } from '../types/user';

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
 
export async function generateTokens(user: iUser): Promise<TokenPair> {
    
    const jti = crypto.randomUUID();
    const refreshExpiresInMs = 7 * 24 * 60 * 60 * 1000; // 7 dias

    const accessToken = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_ACCESS_TOKEN_SECRET as string, 
        { expiresIn: '1m' } // 15 minutos
    );

    const refreshToken = jwt.sign(
        { id: user.id, jti: jti }, 
        process.env.JWT_REFRESH_TOKEN_SECRET as string, 
        { expiresIn: '7d' }
    );

    await prisma.refreshToken.create({
        data: {
            jti: jti,
            userId: user.id,
            expiresAt: new Date(Date.now() + refreshExpiresInMs),
            revoked: false,
        },
    });

    return { accessToken, refreshToken };
}

export const revokeTokenByJti = async (jti: string) => {
    await prisma.refreshToken.updateMany({
        where: { jti: jti },
        data: { revoked: true },
    });
};