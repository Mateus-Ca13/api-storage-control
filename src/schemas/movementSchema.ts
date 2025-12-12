import z from "zod";
import { MovementTypeEnum } from "../../generated/prisma";


export const movementRegisterSchema = z.object({
    type: z.enum(MovementTypeEnum),
    originStockId: z.number().nullable(),
    destinationStockId: z.number().nullable(),
    observations: z.string().optional(),
    userCreatorId: z.number(),
    products: z.array(z.object({
        productId: z.number(),
        quantity: z.number().nonnegative(),
        pricePerUnit: z.number().nonnegative(),
    }))
})

