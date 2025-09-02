import prisma from "../lib/prismaClient"

export const getMainSummaryService = async () => {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const resultData = await prisma.$transaction([
        prisma.product.count(),
        prisma.product.count({ where: { isBelowMinStock: true } }),
        prisma.stockedProduct.aggregate({ _sum: { quantity: true } }),
        prisma.movementBatch.count({ where: { createdAt: { gte: sevenDaysAgo }}
        })
    ]);

    if(resultData.length !== 4){
        throw new Error('Erro ao obter resumo principal');
    }

    return {
        totalProductsRegistered: resultData[0],
        productsBelowMinStock: resultData[1],
        totalStockedQuantity: resultData[2]._sum.quantity || 0,
        totalMovementsLastWeek: resultData[3]
    };
}

export const getProductsSummaryService = async () => {

    const resultData = await prisma.$transaction([
        prisma.stockedProduct.aggregate({ _sum: { quantity: true } }),
        prisma.product.count(),
        prisma.product.count({ where: { codebar: null } }),
        prisma.product.count({ where: { isBelowMinStock: true } }),
    ]);

    if(resultData.length !== 4){
        throw new Error('Erro ao obter resumo de produtos');
    }

    return {
        totalStockedQuantity: resultData[0]._sum.quantity || 0,
        totalProductsRegistered: resultData[1],
        productsWithoutCodebar: resultData[2],
        productsBelowMinStock: resultData[3],
    };
}

export const getStocksSummaryService = async () => {
    
}

export const getMovementsSummaryService = async () => {
    
}

export const getUsersSummaryService = async () => {
    
}
