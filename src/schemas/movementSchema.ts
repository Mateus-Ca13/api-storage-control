import z from "zod";
import { MovementTypeEnum } from "../../generated/prisma";


export const movementRegisterSchema = z.object({
    type: z.enum(MovementTypeEnum),
    originStockId: z.number("O ID do estoque de origem deve ser um número").nullable(),
    destinationStockId: z.number("O ID do estoque de destino deve ser um número").nullable(),
    observations: z.string("O campo de observações deve ser um texto"),
    userCreatorId: z.number("O ID do usuário é inválido"),
    products: z.array(z.object({
        productId: z.number("O ID do produto é inválido"),
        quantity: z.number("A quantidade deve ser um número").nonnegative("A quantidade não pode ser negativa"),
        pricePerUnit: z.number("O preço por unidade deve ser um número").nonnegative("O preço por unidade não pode ser negativo"),
    }))
})

