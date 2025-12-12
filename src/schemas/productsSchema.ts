import z from "zod";
import { ProductMeasurementTuple } from "../types/product";

export const registerProductSchema = z.object({
    name: z.string({error: "O nome do produto deve ser um texto"}).min(3, "O nome do produto deve ter no mínimo 3 caracteres"),
    measurement: z.enum(ProductMeasurementTuple, "Valor não permitido como unidade de medida"), 
    description: z.string({error: "A descrição deve ser um texto"}),
    lastPrice: z.number({error:"O valor do produto deve ser númerico"}).nullable(),
    codebar: z.string({error: "O código de barras deve ser um texto numérico"}).min(5, "Código de barras inválido. O código deve ter no mínimo 5 caracteres").nullable(),
    categoryId: z.number({error: "O ID da categoria deve ser um número"}).nullable(),
    minStock: z.number({error: "A quantidade mínima deve ser um número"}).nonnegative("A quantidade mínima não pode ser negativa"),

});

export const updateProductSchema = z.object({
    name: z.string("O nome do produto deve ser um texto").min(3, "O nome do produto deve ter no mínimo 3 caracteres").optional(),
    measurement: z.enum(ProductMeasurementTuple, "Valor não permitido como unidade de medida").optional(), 
    description: z.string({error:"A descrição deve ser um texto"}).optional(),
    codebar: z.string({error: "O código de barras deve ser um texto numérico"}).min(5, "Código de barras inválido. O código deve ter no mínimo 5 caracteres").optional().nullable(),
    lastPrice: z.number({ error: "O valor do produto deve ser númerico"}).nullable().optional(),
    categoryId: z.number({ error: "O ID da categoria deve ser um número"}).optional().nullable(),
    minStock: z.number({error: "A quantidade mínima deve ser um número"}).nonnegative("A quantidade mínima não pode ser negativa").optional(),

});
    