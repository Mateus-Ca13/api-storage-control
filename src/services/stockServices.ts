import prisma from "../lib/prismaClient";
import { iStocksFilters } from "../types/stock"


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
    
}

export const createStockService = async () => {
    
}

export const updateStockService = async () => {
    
}

export const deleteStockService = async () => {
    
}