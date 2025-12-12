import z from "zod";
import { UserRoleTuple } from "../types/user";

export const registerUserSchema = z.object({
    name: z.string().min(1, "Campo obrigatório"),
    username: z.string().min(1, "Campo obrigatório"),
    email: z.email("Email inválido"),
    role: z.enum(UserRoleTuple),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});


export const updateUserSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  username: z.string().min(1, "Campo obrigatório"),
  email: z.email("Email inválido"),
  role: z.enum(UserRoleTuple),
});

export const updateUserPasswordSchema = z.object({
    currentPassword: z.string().min(1, "Campo obrigatório"),
    newPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

