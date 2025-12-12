import z from "zod";
import { StockStatusTuple, StockTypeTuple } from "../types/stock";

export const registerOrUpdateStockSchema = z.object({
    name: z.string().min(3, "O nome do estoque deve ter no mínimo 3 caracteres"),
    type: z.enum(StockTypeTuple, "Valor não permitido como tipo de estoque"),
    status: z.enum(StockStatusTuple, "Valor não permitido como status do estoque"),
});



