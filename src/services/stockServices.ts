import prisma from "../lib/prismaClient";
import { iStocksFilters, StockCreateInput, StockUpdateInput } from "../types/stock"


export const getAllStocksService = async (stocksFilters: iStocksFilters) => {
    const { offset, limit, name, type, status, orderBy, sortBy } = stocksFilters;
    const stocksOrder = sortBy ?{ [sortBy]: orderBy || 'asc' } : { name: orderBy || 'asc' };

    const where: any = { 
    ...(name && {
        OR: [
            { name: { contains: name, mode: "insensitive" } },
            
        ],
        }),
    ...(type && { type: type }),
    ...(status && { status: status }),
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
        where: { id: id },
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
        where: { id: stockId },
        data: {...stockData, updatedAt: new Date()}
    });

    if(!updatedStock){
        throw new Error('Erro ao atualizar estoque');
    }

    return updatedStock;
}

export const deleteStockService = async (stockId: number) => {

    const stockedProducts = await prisma.stockedProduct.findFirst({
        where: { stockId: stockId, quantity: { gt: 0 } }
    });

    if(stockedProducts){
        throw new Error('Não é possível deletar um estoque que possui produtos armazenados');
    }

    const deletedStock = await prisma.stock.delete({
        where: { id: stockId }
    });

    if(!deletedStock){
        throw new Error('Erro ao deletar estoque');
    }

    return deletedStock;

}