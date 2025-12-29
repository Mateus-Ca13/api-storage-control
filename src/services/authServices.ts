
import bcrypt from "bcryptjs";
import prisma from "../lib/prismaClient";
import { generateTokens, revokeTokenByJti } from "../utils/tokensUtils";

export const loginUserService = async (usernameOrEmail: string, password: string) => {
    const user = await prisma.user.findFirst({
        where: {
            active: true,
            OR: [
                { email: { equals: usernameOrEmail, mode: "insensitive" }, },
                { username: { equals: usernameOrEmail, mode: "insensitive" } },
            ],
        }
    });

    if(!user){
        throw new Error('Email ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if(!isPasswordValid){
        throw new Error('Email ou senha inválidos.');
    }

    const {accessToken, refreshToken} = await generateTokens(user);

    if(!accessToken || !refreshToken){
        throw new Error('Error ao criar tokens de acesso.');
    }
    
    return { accessToken, refreshToken, userInfo: {email: user.email, role: user.role, username: user.name}};
}

export const logoutUserService = async (jti: string) => {

    const storedTokens = await prisma.refreshToken.updateMany({
        where: { jti: jti, revoked: false },
        data: { revoked: true }
    });

    if(storedTokens.count === 0){
        throw new Error('Token inválido ou já revogado.');
    }

    return { message: 'Logout realizado com sucesso. Sessão revogada.' };
}

export const refreshTokenService = async (jti: string) => {

    const storedToken = await prisma.refreshToken.findUnique({
        where: { jti: jti }
    }); 
    if(!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()){
        throw new Error('Token inválido ou expirado');
    }

    const user = await prisma.user.findUnique({
        where: { id: storedToken.userId, active: true}
    });
    if(!user){
        throw new Error('Usuário não encontrado');
    }

    await revokeTokenByJti(jti);
    const { accessToken, refreshToken } = await generateTokens(user);

    return { accessToken, refreshToken }
}