import prisma from "../lib/prismaClient";
import { iUsersFilters, UserCreateInput, UserUpdateInput } from "../types/user";
import bcrypt from 'bcrypt';



export const getAllUsersService = async (usersFilters: iUsersFilters) => {
    const { offset, limit, name, orderBy, sortBy } = usersFilters;
    const orderField = sortBy ?? 'name';
    const where: any = {
        ...(name && {
            OR: [
                { name: { contains: name, mode: "insensitive" } },
                { username: { contains: name, mode: "insensitive" } },
                { email: { contains: name, mode: "insensitive" } },
            ],
        }),
    };

    const [resultData, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: {
                [orderField]: orderBy || 'asc',
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
            },
        }),
        prisma.user.count({ where }),
    ])

    
    return {
        pagination: {
            total,
            offset,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        users: resultData,
    }
}

export const getUserByIdService = async (id: number) => {
    const data = await prisma.user.findUnique({
        where: { id: id },
    });

    if(!data){
        throw new Error('Usuário não encontrado');
    }

    return data;
}

export const updateUserService = async (userId: number, userData: UserUpdateInput) => {

    const existingUser =  await prisma.user.findFirst({
        where: {
            id: { not: userId },
            OR: [
            { email: userData.email },
            { username: userData.username },
            ],
        },
    });

    if(existingUser){
        throw new Error('O usuário e/ou email fornecidos já existem!');
    }
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {...userData, updatedAt: new Date()}
    });

    if(!updatedUser){
        throw new Error('Erro ao atualizar usuário');
    }

    return updatedUser;
    
}

export const updatePasswordService = async (userId: number, currentPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
    });

    if(!user){
        throw new Error('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if(!isPasswordValid){
        throw new Error('Senha atual inválida.');
    }

    const newPasswordHash = bcrypt.hashSync(newPassword, 10);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { password: newPasswordHash, updatedAt: new Date() }
    });

    if(!updatedUser){
        throw new Error('Erro ao atualizar senha do usuário');
    }
    return updatedUser;
}

export const createUserService = async (userData: UserCreateInput) => {
    const existingUser =  await prisma.user.findFirst({
        where: {
            OR: [ 
                
            { email: userData.email },
            { username: userData.username },
            ],
        },
    });

    if(existingUser){
        throw new Error('O usuário fornecido já existe!');
    }

    const passwordHash = bcrypt.hashSync(userData.password, 10);
    const formattedUserData = {...userData, password: passwordHash, createdAt: new Date()};
    
    const newUser = await prisma.user.create({
        data: formattedUserData
    });

    if(!newUser){
        throw new Error('Erro ao criar usuário');
    }

    const { password, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
}


export const deleteUserService = async (userId: number) => {
    
}