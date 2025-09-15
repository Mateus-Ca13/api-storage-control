import prisma from "../lib/prismaClient"

export const getMainSummaryService = async () => {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const resultData = await prisma.$transaction([
        prisma.product.count(),
        prisma.product.count({ where: { createdAt: { gte: sevenDaysAgo } } }), 
        prisma.product.count({ where: { isBelowMinStock: true } }),
        prisma.stockedProduct.aggregate({ _sum: { quantity: true } }),
        prisma.movementProduct.aggregate({ _sum: { quantity: true }, where: { movementBatch: { type: 'EXIT', createdAt: {gte: yesterday } } } }),
        prisma.movementBatch.count({ where: { createdAt: { gte: sevenDaysAgo }}}),
        prisma.movementBatch.count({ where: { createdAt: { gte: yesterday }}}),
    ]);

    if(resultData.length !== 7){
        throw new Error('Erro ao obter resumo principal');
    }
    
    return {
        totalProductsRegistered: {value:resultData[0], metrics: `+${resultData[1]} nos últimos 7 dias`},
        productsBelowMinStock: {value: resultData[2], metrics: 'Atenção necesssária'},
        totalStockedQuantity: {value: Math.ceil(Number(resultData[3]._sum.quantity) || 0), metrics: `${resultData[4]._sum.quantity ? resultData[4]._sum.quantity : 0} saídas desde ontem`},
        totalMovementsLastWeek:  {value: resultData[5], metrics: `${resultData[6]} desde ontem`}
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
        totalStockedQuantity: Number(resultData[0]._sum.quantity) || 0,
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
