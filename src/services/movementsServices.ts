import { Prisma } from "@prisma/client";
import prisma from "../lib/prismaClient";
import { iMovementFilters, MovementCreateInput, MovementUpdateInput } from "../types/movementBatch"
import { iCreateMovementProduct } from "../types/movementProduct";
import { calculateMinStockStatus } from "../utils/calculateMinStockStatus";
import { validateIfProductsAreActive, validateIfStocksAreActive, validateIfUserExists } from "../utils/validateActive";


export const getAllMovementsService = async (movementsFilters: iMovementFilters) => {
    const { offset, limit, name, orderBy, type, sortBy, sentFrom, sentTo, userId } = movementsFilters;
    const orderField = !sortBy ?
        { createdAt: orderBy || 'asc' } :
        sortBy === 'userCreator' ?
            { userCreator: { name: orderBy || 'asc' } } :
            { [sortBy]: orderBy || 'asc' }

    const where: any = {
        ...(name && {
            OR: [
                { originStock: { name: { contains: name, mode: "insensitive" } } },
                { destinationStock: { name: { contains: name, mode: "insensitive" } } },
                { userCreator: { name: { contains: name, mode: "insensitive" } } },
                { observations: { contains: name, mode: "insensitive" } },


            ],
        }),
        ...(type && { type: type }),
        ...(sentFrom && { originStockId: sentFrom }),
        ...(sentTo && { destinationStockId: sentTo }),
        ...(userId && { userCreatorId: userId })
    };

    const [resultData, total] = await Promise.all([
        prisma.movementBatch.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: orderField,
            select: {
                id: true,
                type: true,
                originStock: {
                    select: { name: true, id: true },
                },
                destinationStock: {
                    select: { name: true, id: true },
                },
                products: { 
                    select: { quantity: true }
                },
                createdAt: true,
                userCreator: {
                    select: { name: true },
                },

            },
        }),
        prisma.movementBatch.count({ where })
    ])

    const movements = resultData.map((c) => ({
        id: c.id,
        type: c.type,
        originStock: c.originStock,
        destinationStock: c.destinationStock,
        user: c.userCreator.name,
        createdAt: c.createdAt,
        totalProducts: c.products.map(p => p.quantity).reduce((a, b) => a + Number(b), 0),
    }))

    return {
        pagination: {
            total,
            offset,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        movements: movements
    }

}

export const getMovementByIdService = async (id: number) => {
    const data = await prisma.movementBatch.findUnique({
        where: { id: id },
        include: {
            products: {
                select: {
                    id: true,
                    quantity: true,
                    pricePerUnit: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            category: {
                                select: {
                                    name: true,
                                    colorPreset: true,
                                }
                            },
                            codebar: true,
                            measurement: true,
                        }
                    }
                }
            },
            originStock: {
                select: { name: true, type: true }
            },
            destinationStock: {
                select: { name: true, type: true }
            },
            userCreator: {
                select: { name: true, email: true }
            }
        }
    });

    if (!data) {
        throw new Error('Movimentação não encontrada');
    }

    const movement = {
        ...data,
        products: data.products.map(p => ({
            id: p.id,
            quantity: Number(p.quantity),
            pricePerUnit: Number(p.pricePerUnit),
            product: p.product
        }))
    }

    return movement;
}

export const createMovementService = async (movementData: MovementCreateInput) => {
    const { products, ...movementBatchData } = movementData;
    
    return prisma.$transaction(async (tx) => {

        await validateIfStocksAreActive(tx, [movementData.originStockId, movementData.destinationStockId])
        await validateIfProductsAreActive(tx, products.map(p => p.productId))
        await validateIfUserExists(tx, movementData.userCreatorId)

        const batch = await tx.movementBatch.create({
            data: {
                ...movementBatchData,
                createdAt: new Date()
            },
        });

        // cria todos os movementProducts em paralelo
        await tx.movementProduct.createMany({
            data: products.map((p) => ({
                movementBatchId: batch.id,
                productId: p.productId,
                quantity: p.quantity,
                pricePerUnit: p.pricePerUnit,
            })),
        });

        if (batch.type === 'ENTRY') {
            if (!batch.destinationStockId)
                throw new Error("Estoque de destino é obrigatório em movimentações de entrada.");
            // Atualiza quantidade de produtos 
            await Promise.all(
                products.map((p) =>
                    tx.stockedProduct.upsert({
                        where: {
                            stockId_productId: {
                                stockId: batch.destinationStockId!,
                                productId: p.productId,
                            },
                        },
                        update: { quantity: { increment: p.quantity } },
                        create: {
                            stockId: batch.destinationStockId!,
                            productId: p.productId,
                            quantity: p.quantity,
                        },
                    })
                ),
            );
            // atualizar o lastPrice para cada produto da entrada
            await Promise.all(
                products.map((p) =>
                    tx.product.update({
                        where: { id: p.productId },
                        data: {
                            lastPrice: p.pricePerUnit
                        }
                    })
                )
            );

        }

        if (batch.type === 'EXIT') {
            if (!batch.originStockId)
                throw new Error("Estoque de origem é brigatório em saídas");

            for (const p of products) {
                const item = await tx.stockedProduct.findUnique({
                    where: {
                        stockId_productId: {
                            stockId: batch.originStockId!,
                            productId: p.productId,
                        },
                    },
                });

                if (!item || item.quantity.lessThan(p.quantity)) {
                    throw new Error(`Estoque insuficiente para o produto de ID ${p.productId}.`);
                }
            }

            await Promise.all(
                products.map((p) =>
                    tx.stockedProduct.update({
                        where: {
                            stockId_productId: {
                                stockId: batch.originStockId!,
                                productId: p.productId,
                            },
                        },
                        data: { quantity: { decrement: p.quantity } },
                    })
                )
            );
        }

        if (batch.type === 'TRANSFER') {
            if (!batch.originStockId || !batch.destinationStockId)
                throw new Error("Estoque de origem e destino são obrigatórios em transferências");

            // valida origem primeiro
            for (const p of products) {
                const origin = await tx.stockedProduct.findUnique({
                    where: {
                        stockId_productId: {
                            stockId: batch.originStockId!,
                            productId: p.productId,
                        },
                    },
                });

                if (!origin || origin.quantity.lessThan(p.quantity)) {
                    throw new Error(`Estoque insuficiente para o produto de ID ${p.productId}.`);
                }
            }

            // atualiza origem + destino em paralelo
            await Promise.all(
                products.map((p) =>
                    Promise.all([
                        tx.stockedProduct.update({
                            where: {
                                stockId_productId: {
                                    stockId: batch.originStockId!,
                                    productId: p.productId,
                                },
                            },
                            data: { quantity: { decrement: p.quantity } },
                        }),
                        tx.stockedProduct.upsert({
                            where: {
                                stockId_productId: {
                                    stockId: batch.destinationStockId!,
                                    productId: p.productId,
                                },
                            },
                            update: { quantity: { increment: p.quantity } },
                            create: {
                                stockId: batch.destinationStockId!,
                                productId: p.productId,
                                quantity: p.quantity,
                            },
                        }),
                    ])
                )
            );
        }

       await recalcBelowMinStock(tx, products)

        return batch;
    });
};

export const updateMovementService = async (movementId: number, movementData: MovementUpdateInput) => {

}

export const deleteMovementService = async (movementId: number) => {

}


// ============= Services Auxiliares =============/

const recalcBelowMinStock = async (tx: Prisma.TransactionClient, products: iCreateMovementProduct[]) => {

    for (const p of products) {
        const product = await tx.product.findUnique({ where: { id: p.productId } });
        // Usa o mesmo helper
        const isBelow = await calculateMinStockStatus(tx, p.productId, product.minStock);

        await tx.product.update({
            where: { id: p.productId },
            data: { isBelowMinStock: isBelow },
        });
    }
}