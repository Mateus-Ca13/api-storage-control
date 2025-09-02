import { z } from "zod";
import { UserRoleTuple } from "../types/user";

export const registerUserSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
    role: z.enum(UserRoleTuple, "Função de usuário inválida"),
    email: z.email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirmação de senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export const loginUserSchema = z.object({
    email: z.email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});


