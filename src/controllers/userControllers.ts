import { Request, Response } from "express"
import { sendErrorResponse, sendResponse } from "../utils/response";
import {  createUserService, getAllUsersService, getUserByIdService, updatePasswordService, updateUserService } from "../services/userServices";
import { updateUserPasswordSchema, updateUserSchema } from "../schemas/userSchemas";
import { UserCreateInput, UserUpdateInput } from "../types/user";
import { registerUserSchema } from "../schemas/authSchemas";


export const getAllUsersController = async (req: Request, res: Response) => {
    const { offset = "0", limit = "10", name, orderBy, sortBy } = req.query;
    try {
        const result = await getAllUsersService({
          limit: Number(limit),
          offset: Number(offset),
          name: name as string | undefined,
          orderBy: orderBy as 'asc' | 'desc',
          sortBy: sortBy as 'name' | 'role' | undefined,
        });
        sendResponse(res, result, 'Lista de usuários retornada com sucesso', true, 200);

    } catch (error: unknown) {
        sendErrorResponse(res, error, 500);
    }
}

export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await getUserByIdService(Number(id));
        sendResponse(res, result, 'Usuário retornado com sucesso', true, 200);

    } catch (error: unknown) {
        sendErrorResponse(res, error, 500);
    }
    
}   

export const updateUserController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userData = updateUserSchema.parse(req.body);
        const result = await updateUserService(Number(id), userData);
        sendResponse(res, result, 'Usuário atualizado com sucesso', true, 200);
        
    } catch (error: unknown) {
        sendErrorResponse(res, error, 500);
    }
}

export const updateUserPasswordController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const  {newPassword, currentPassword}  =  updateUserPasswordSchema.parse(req.body);
        const result = await updatePasswordService(Number(id), currentPassword, newPassword);
        sendResponse(res, result, 'Senha do usuário atualizada com sucesso', true, 200);
    } catch (error: unknown) {
        sendErrorResponse(res, error, 500);
    }
}

export const createUserController = async (req: Request, res: Response) => {
    try {
        const {confirmPassword, ...userDataWithoutConfirm} = registerUserSchema.parse(req.body);
        const userData: UserCreateInput = userDataWithoutConfirm;
        const returnUser = await createUserService(userData) ;
        sendResponse(res, returnUser, 'Usuário registrado com sucesso', true, 201);
        
    }catch (error: unknown) {
        sendErrorResponse(res, error, 400);
    }
}

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        
    } catch (error: unknown) {
        sendErrorResponse(res, error, 500);
    }
}
