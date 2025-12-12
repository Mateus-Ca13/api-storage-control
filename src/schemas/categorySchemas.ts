import z from "zod";

export const registerOrUpdateCategorySchema = z.object({
    name: z.string().min(1, "O nome da categoria deve ter no mínimo 1 caractere"),
    colorPreset: z.number().min(1, "O valor do padrão de cor é inválido"),
});



