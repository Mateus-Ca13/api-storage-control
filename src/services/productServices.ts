import prisma from "../lib/prismaClient";
import { iProduct, iProductsFilters, ProductCreateInput, ProductUpdateInput } from "../types/product";



export const getAllProductsService = async (productsFIlters: iProductsFilters) => {

    const { offset, limit, name, categoryId, isBelowMinStock, orderBy, sortBy } = productsFIlters;

    console.log(offset, limit, name, categoryId, isBelowMinStock, orderBy, sortBy)

    const productsOrder = sortBy ? { [sortBy]: orderBy || 'asc' } : { name: orderBy || 'asc' };
    const where: any = { // Seta os filtros dinamicamente
    ...(name && {
        OR: [
            { name: { contains: name, mode: "insensitive" } },
            { description: { contains: name, mode: "insensitive" } },
            { codebar: { contains: name, mode: "insensitive" } },
        ],
        }),
    ...(categoryId && { categoryId }),
    ...(isBelowMinStock !== undefined && { isBelowMinStock: isBelowMinStock === 'true'})
    };
    
    const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: productsOrder,
      select: {
        id: true,
        name: true,
        category: {select: { name: true }},
        codebar: true,
        minStock: true,
        isBelowMinStock: true,
        stockedQuantities: {select: { quantity: true } },
      },
      
    }),
    prisma.product.count({ where }),
  ]);

    return {
        pagination: {
            total,
            offset,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data
    }
};


export const getProductByIdService = async (id: string) => {
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

export const updateProductService = async (productId: string, newProductProps: ProductUpdateInput) => {
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


export const deleteProductService = async (productId: string) => {
    const result = await prisma.product.delete({
        where: { id: productId }
    })

    if(!result){
        throw new Error('Erro ao deletar produto');
    }

    return result;
};
    