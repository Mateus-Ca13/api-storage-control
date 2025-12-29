import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// helpers/stockCalculator.ts
export const calculateMinStockStatus = async (tx: Prisma.TransactionClient, productId: number, minStock: Decimal) => {
    const aggregation = await tx.stockedProduct.aggregate({
        where: { productId },
        _sum: { quantity: true }
    });
    const totalQty = aggregation._sum.quantity || new Decimal(0);
    return totalQty.lessThan(minStock);
}