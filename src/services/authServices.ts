
import bcrypt from "bcryptjs";
import { iUser, UserCreateInput } from "../types/user";
import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient";
import { RefreshToken } from "../../generated/prisma";

export const loginUserService = async (email: string, password: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: 'insensitive'
            }
        }
    });

    if(!user){
        throw new Error('Email ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if(!isPasswordValid){
        throw new Error('Email ou senha inválidos.');
    }

    const refreshToken = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    
    const refreshTokenToDb = { 
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7*24*60*60*1000), // 7 days
        revoked: false  
    };

    const refreshTokenEntry: RefreshToken = await prisma.refreshToken.create({
        data: refreshTokenToDb
    });

    if(!refreshTokenEntry){
        throw new Error('Error ao criar refresh token');
    }
    
    return { accessToken, refreshToken };
 }

export const logoutUserService = async (refreshToken: string) => {

    const storedTokens = await prisma.refreshToken.updateMany({
        where: { token: refreshToken, revoked: false },
        data: { revoked: true }
    });

    if(storedTokens.count === 0){
        throw new Error('Token inválido ou já revogado');
    }

    return { message: 'Logout realizado com sucesso' };
}

export const refreshTokenService = async (refreshToken: string) => {

    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken }
    }); 
    if(!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()){
        throw new Error('Token inválido ou expirado');
    }

    const user = await prisma.user.findUnique({
        where: { id: storedToken.userId }
    });
    if(!user){
        throw new Error('Usuário não encontrado');
    }
    const newAccessToken = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    
    return { accessToken: newAccessToken }
}