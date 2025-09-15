import { Decimal } from "../../generated/prisma/runtime/library";
import prisma from "../lib/prismaClient";
import { iProduct, iProductsFilters, ProductCreateInput, ProductUpdateInput } from "../types/product";



export const getAllProductsService = async (productsFIlters: iProductsFilters) => {

    const { offset, limit, name, categoriesIds, isBelowMinStock, orderBy, sortBy, hasNoCodebar } = productsFIlters;
    const productsOrder = sortBy && sortBy !== 'stockedQuantities' ?{ [sortBy]: orderBy || 'asc' } : { name: orderBy || 'asc' };

    
    // Contabiliza quantidades, se necessário. 
    const stockedProducts = sortBy === 'stockedQuantities' ? 
    await prisma.stockedProduct.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: orderBy || 'desc' } },
    
    }).then((res) => res.map((p) => p.productId)
    ) : null;

    // Seleciona os filtros
    const where: any = { 
    ...(name && {
        OR: [
            { name: { contains: name, mode: "insensitive" } },
            { description: { contains: name, mode: "insensitive" } },
            { codebar: { contains: name, mode: "insensitive" } },
        ],
        }),
    ...(hasNoCodebar? { codebar: null  } : {}),
    ...(categoriesIds?.length && { categoryId: { in: categoriesIds } }),
    ...(isBelowMinStock !== undefined && { isBelowMinStock: isBelowMinStock === 'true'}),
    };

    // Seleciona campos
    const select = {
        id: true,
        name: true,
        category: {select: { name: true, colorPreset: true }},
        codebar: true,
        minStock: true,
        lastPrice: true,
        isBelowMinStock: true,
        measurement: true,
        stockedQuantities: {select: { quantity: true } },
      };
    
    let [data, total] = await Promise.all([
    prisma.product.findMany({
      where: {...where, ...(stockedProducts? { id: { [orderBy === 'desc' ? 'in': 'notIn']: stockedProducts } } : {})},
      skip: offset,
      take: limit,
      orderBy: productsOrder,
      select: select,
      
    }),
    prisma.product.count({ where }),
  ]);

  console.log(orderBy === 'desc' ? 'in stockedProducts: ': 'notIn stockedProducts:', data.length)


    if(data.length < limit && stockedProducts){
        console.log('limit:', limit, 'stockedProducts:' ,stockedProducts)
       const remainingData = await prisma.product.findMany({
            where : {...where, ...(stockedProducts? { id: { [orderBy === 'desc' ? 'notIn': 'in']: stockedProducts } } : {}) },
            skip: offset,
            take: limit - data.length,
            orderBy: productsOrder,
            select: select
        })
        
        data = [...remainingData, ...data]
        console.log(orderBy === 'desc' ? 'notIn stockedProducts: ': 'in stockedProducts:', remainingData.length)
    }   

    let products = data.map((p) => ({
        ...p,
        minStock: Number(p.minStock),
        stockedQuantities: p.stockedQuantities
            .reduce((sum, sq) => sum + Number(sq.quantity), 0),
    }));

    products = sortBy === 'stockedQuantities' ? [...products].sort((a, b) => {
    if (a["stockedQuantities"] < b["stockedQuantities"]) return orderBy === "asc" ? -1 : 1;
    if (a["stockedQuantities"] > b["stockedQuantities"]) return orderBy === "asc" ? 1 : -1;
    return 0;
    }) : products;

    return {
        pagination: {
            total,
            offset,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        products: products
    }
};


export const getProductByIdService = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: { id: id },
        include: { stockedQuantities: true, category: true }
    });

    if(!product){
        throw new Error('Produto não encontrado');
    }

    return product;
};

export const createProductService = async (productData: ProductCreateInput) => {

    const formattedProductData = { ...productData, createdAt: new Date()};

    const newProduct = await prisma.product.create({
        data: formattedProductData
    });

    if(!newProduct){
        throw new Error('Erro ao criar produto');
    }

    return {...newProduct, minStock: Number(newProduct.minStock)} as iProduct;
};

export const updateProductService = async (productId: number, newProductProps: ProductUpdateInput) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if(!existingProduct){
        throw new Error('Produto não encontrado');
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {...newProductProps}
    });

    if(!updatedProduct){
        throw new Error('Erro ao atualizar produto');
    }

    return {...updatedProduct, minStock: Number(updatedProduct.minStock)} as iProduct;
};


export const deleteProductService = async (productId: number) => {
    const result = await prisma.product.delete({
        where: { id: productId }
    })

    if(!result){
        throw new Error('Erro ao deletar produto');
    }

    return result;
};

    