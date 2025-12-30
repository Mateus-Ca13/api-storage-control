import { Prisma } from "@prisma/client";
import { Product } from "../../generated/prisma";

const validateIfStocksAreActive = async (tx: Prisma.TransactionClient, stocksIds: (number | null | undefined)[]) => {
    // 1. Remove nulos, undefined e duplicatas
    const cleanIds = [...new Set(stocksIds.filter((id): id is number => id !== null && id !== undefined))];

    if (cleanIds.length > 0) {
        const foundStocks = await tx.stock.findMany({
            where: {
                id: { in: cleanIds },
                active: true,
            },
            select: { id: true } // select leve, só precisamos do ID
        });

        // Comparamos com o cleanIds que só tem números válidos
        if (foundStocks.length !== cleanIds.length) {
            throw new Error("Operação negada: Um ou mais estoques selecionados estão desativados ou não existem.");
        }
    }
}

const validateIfProductsAreActive = async (tx: Prisma.TransactionClient, productsIds: number[]) => {
    // Remove duplicatas para a comparação de length ser precisa
    const uniqueIds = [...new Set(productsIds)];

    const activeProducts: Product[] = await tx.product.findMany({
        where: {
            id: { in: uniqueIds },
            active: true
        },
        select: { id: true }
    });

    if (activeProducts.length !== uniqueIds.length) {
        const activeIds = activeProducts.map(p => p.id);
        const missingIds = uniqueIds.filter(id => !activeIds.includes(id));
        
        throw new Error(`Operação cancelada: Os produtos com ID [${missingIds.join(', ')}] não estão ativos ou não existem.`);
    }
}

const validateIfUserExists = async (tx: Prisma.TransactionClient, userId: number) => {
    const user = await tx.user.findUnique({
        where: { id: userId, active: true },
        select: { id: true }
    });

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
}

export { validateIfStocksAreActive, validateIfProductsAreActive, validateIfUserExists }
//