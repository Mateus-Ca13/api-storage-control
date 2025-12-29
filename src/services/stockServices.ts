import prisma from "../lib/prismaClient";
import { iStocksFilters, StockCreateInput, StockUpdateInput } from "../types/stock"


export const getAllStocksService = async (stocksFilters: iStocksFilters) => {
    const { offset, limit, name, type, status, orderBy, sortBy } = stocksFilters;
    const stocksOrder = sortBy ?{ [sortBy]: orderBy || 'asc' } : { name: orderBy || 'asc' };

    const where: any = {
        AND: [
            { active: true }, 
            ...(name ? [{
                OR: [
                    { name: { contains: name, mode: "insensitive" } },
                ]
            }] : []),
            ...(type ? [{ type }] : []),
            ...(status ? [{ status }] : []),
        ]
    };

    const [data, total] = await Promise.all([ prisma.stock.findMany({
        where: where,
        skip: offset,
        take: limit,
        orderBy: stocksOrder,
        select: {
            id: true,
            name: true,
            type: true,
            status: true,
            stockedProducts: {
                select: { quantity: true },
            },
        }  
    })
    , prisma.stock.count({ where })]);

    

    let stocks = data.map((s) => ({
        ...s,
        stockedQuantities: s.stockedProducts.reduce((sum, sq) => sum + Number(sq.quantity), 0),
    }));
    
    return {
        pagination: {
            total,
            offset,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        stocks: stocks}
        

} 

export const getStockByIdService = async (id: number) => {
    
    const [data, total] = [await prisma.stock.findUnique({
        where: { id: id, active: true },
    }),
    await prisma.stockedProduct.aggregate({
        _sum: {
            quantity: true,
        },
        where: {
            stockId: id, 
        },
    })]

    if(!data){
        throw new Error('Estoque não encontrado');
    }

    const stock = {
        ...data,
        stockedQuantities: Number(total._sum.quantity),
    }
    return stock;
}

export const createStockService = async (stockData: StockCreateInput) => {

    const existingStock = await prisma.stock.findFirst({
        where: {
            active: true,
            name: stockData.name
        },
    });

    if(existingStock){
        throw new Error('O nome do estoque fornecido já está em uso.');
    }

    const newStock = await prisma.stock.create({
        data: stockData
    });

    if(!newStock){
        throw new Error('Erro ao criar estoque');
    }

    return newStock;
    
}

export const updateStockService = async (stockId: number, stockData: StockUpdateInput) => {
    const updatedStock = await prisma.stock.update({
        where: { id: stockId, active: true},
        data: {...stockData, updatedAt: new Date()}
    });

    if(!updatedStock){
        throw new Error('Erro ao atualizar estoque');
    }
    return updatedStock;
}

export const deleteStockService = async (stockId: number) => {

    const itemsInside = await prisma.stockedProduct.count({
        where: { 
            stockId: stockId, 
            quantity: { gt: 0 } 
        }
    });

    if (itemsInside > 0) {
        throw new Error('Não é possível deletar um estoque que ainda possui produtos armazenados.');
    }

    const hasHistory = await prisma.movementBatch.count({
        where: {
            OR: [
                { originStockId: stockId },
                { destinationStockId: stockId }
            ]
        }
    });

    if (hasHistory > 0) {
        //SOFT DELETE 
        try {

            const stock = await prisma.stock.update({
                where: { id: stockId },
                data: { status: 'INACTIVE', active: false},
            });
            console.log(`Estoque [ ${stock.name} ] deletado via SOFT DELETE.`);
            return stock;

        } catch (error: any) {
             if (error.code === 'P2025') throw new Error('Estoque não encontrado.');
             throw error;
        }

    } else {
        // HARD DELETE
        try {
            const [_deletedStockedProducts, deletedStock ] = await prisma.$transaction([
                prisma.stockedProduct.deleteMany({ where: { stockId: stockId } }),
                prisma.stock.delete({ where: { id: stockId } })
            ]);

            console.log(`Estoque [ ${deletedStock.name} ] deletado via HARD DELETE.`);
            return deletedStock;

        } catch (error: any) {
            if (error.code === 'P2025') throw new Error('Estoque não encontrado.');
            throw error;
        }
    }
};