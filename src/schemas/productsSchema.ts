import z from "zod";
import { ProductMeasurementTuple } from "../types/product";

export const registerProductSchema = z.object({
    name: z.string().min(3, "O nome do produto deve ter no mínimo 3 caracteres"),
    measurement: z.enum(ProductMeasurementTuple, "Valor não permitido como unidade de medida"), 
    description: z.string(),
    lastPrice: z.number().nullable(),
    codebar: z.string().min(5, "Código de barras inválido").nullable(),
    categoryId: z.number().nullable(),
    minStock: z.number().nonnegative("A quantidade mínima não pode ser negativa"),

});

export const updateProductSchema = z.object({
    name: z.string().min(3, "O nome do produto deve ter no mínimo 3 caracteres").optional(),
    measurement: z.enum(ProductMeasurementTuple, "Valor não permitido como unidade de medida").optional(), 
    description: z.string().optional(),
    codebar: z.string().min(5, "Código de barras inválido").optional(),
    lastPrice: z.number().nullable().optional(),
    categoryId: z.number().optional(),
    minStock: z.number().nonnegative("A quantidade mínima não pode ser negativa").optional(),

});
    