import z from "zod";
import { UserRoleTuple } from "../types/user";

export const registerUserSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    username: z.string().min(3, "O nome de usuário deve ter no mínimo 3 caracteres"),
    email: z.email("Email inválido"),
    role: z.enum(UserRoleTuple),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});


export const updateUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  username: z.string().min(3, "O nome de usuário deve ter no mínimo 3 caracteres"),
  email: z.email("Email inválido"),
  role: z.enum(UserRoleTuple),
});

export const updateUserPasswordSchema = z.object({
    currentPassword: z.string().min(1, "Campo obrigatório"),
    newPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

