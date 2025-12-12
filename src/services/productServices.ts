import prisma from "../lib/prismaClient";
import { registerProductSchema } from "../schemas/productsSchema";
import { iProduct, iProductsFilters, ProductCreateInput, ProductUpdateInput } from "../types/product";
import csv from "csvtojson";


export const getAllProductsService = async (productsFilters: iProductsFilters) => {

    const { offset, limit, name, categoriesIds, isBelowMinStock, stockId, orderBy, sortBy, hasNoCodebar } = productsFilters;
    const orderField = sortBy === 'stockedQuantities' ? 'stocked_quantities' : sortBy === 'categoryId' ? '"categoryId"' : sortBy ?? 'name';
    const orderDirection = orderBy?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const whereConditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Filtros
    if (name) {
    whereConditions.push(`(
        p.name ILIKE $${paramIndex} OR
        p.description ILIKE $${paramIndex} OR
        p.codebar ILIKE $${paramIndex}
    )`);
    params.push(`%${name}%`);
    paramIndex++;
    }

    if (hasNoCodebar) {
    whereConditions.push(`p.codebar IS NULL`);
    }

    if (categoriesIds?.length) {
    whereConditions.push(`p."categoryId" = ANY($${paramIndex})`);
    params.push(categoriesIds);
    paramIndex++;
    }

    if (isBelowMinStock !== undefined) {
    whereConditions.push(`p."isBelowMinStock" = $${paramIndex}`);
    params.push(isBelowMinStock === 'true');
    paramIndex++;
    }

    if (stockId !== undefined) {
        whereConditions.push(`p.id IN (
            SELECT "productId" FROM "StockedProduct" WHERE "stockId" = $${paramIndex}
        )`);
        params.push(stockId);
        paramIndex++;
    }

    const whereSql = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const stockJoinSql = stockId !== undefined 
        ? `LEFT JOIN "StockedProduct" sp ON sp."productId" = p.id AND sp."stockId" = ${stockId}`
        : `LEFT JOIN "StockedProduct" sp ON sp."productId" = p.id`;
    
        
        // Query principal
    const products = await prisma.$queryRawUnsafe<any[]>(`
    SELECT
        p.id,
        p.name,
        p.codebar,
        p."minStock",
        p."lastPrice",
        p."isBelowMinStock",
        p.measurement,
        c.name as category_name,
        c."colorPreset" as category_color,
        COALESCE(SUM(sp.quantity), 0) as stocked_quantities
        FROM "Product" p
        LEFT JOIN "Category" c ON c.id = p."categoryId" 
        ${stockJoinSql}
        ${whereSql}
        GROUP BY p.id, c.name, c."colorPreset"
        ORDER BY ${orderField} ${orderDirection}
        OFFSET ${offset}
        LIMIT ${limit};
        `, ...params);

    // Total para paginação
    const total = await prisma.$queryRawUnsafe<any[]>(`
        SELECT COUNT(*)
        FROM "Product" p
        ${whereSql};
        `, ...params);

    return {
    pagination: {
        total: Number(total[0].count),
        offset,
        limit,
        totalPages: Math.ceil(Number(total[0].count) / limit),
    },
    products: products.map(p => ({
        id: p.id,
        name: p.name,
        codebar: p.codebar? p.codebar : null,
        minStock: Number(p.minStock),
        lastPrice: p.lastPrice,
        isBelowMinStock: p.isBelowMinStock,
        measurement: p.measurement,
        category: (!!p.category_name || !!p.category_color) ? { name: p.category_name, colorPreset: p.category_color } : null,
        stockedQuantities: Number(p.stocked_quantities),
    }))
    };
};

export const getProductByIdService = async (id: number) => {
    
    const prodData = await prisma.product.findUnique({
        where: { id: id },
        include: { stockedQuantities: {select: {stock: {select: {id: true, name: true, type: true}}, quantity: true}, where: { quantity: {gt: 0}}}, 
        category: true, 
        movements: {orderBy: {movementBatch: {createdAt:'desc'}}, select: {id: true,  quantity: true, movementBatch: {select: {id: true, createdAt: true, type: true, originStock: {select: {id: true, name: true}}, destinationStock: {select: {id: true, name: true}}}} },
        }}
    })

    if(!prodData){
        throw new Error('Produto não encontrado');
    }
    

    const product = {...prodData, minStock: Number(prodData.minStock), 
        lastPrice: Number(prodData.lastPrice), 
        stockedQuantities: prodData.stockedQuantities.map(sq => ({...sq, quantity: Number(sq.quantity)})),
        movements: prodData.movements.map(m => ({...m, quantity: Number(m.quantity)})),
    };

    return product;
};

export const getProductByCodebarService = async (codebar: string, stockId?: number) => {

    if(!codebar || codebar.trim() === ''){
        throw new Error('Código de barras inválido.');
    }
    
    const prodData = await prisma.product.findUnique({
        where: { codebar: codebar },
        include: { stockedQuantities: {select: {stock: {select: {id: true, name: true, type: true}}, quantity: true}, where: { quantity: {gt: 0}, stockId: stockId ? stockId : undefined}}, 
        category: true, 
        movements: {orderBy: {movementBatch: {createdAt:'desc'}}, select: {id: true,  quantity: true, movementBatch: {select: {id: true, createdAt: true, type: true, originStock: {select: {id: true, name: true}}, destinationStock: {select: {id: true, name: true}}}} },
        }}
    })

    if (!prodData) {
        // Cenário 1: O produto com este codebar simplesmente não existe no banco de dados.
        throw new Error('Produto não cadastrado.');

    } else if (stockId && prodData.stockedQuantities.length === 0) {
        // Cenário 2: O produto existe, mas não há estoque disponível no local especificado.
        throw new Error('Produto sem estoque na origem informada.');

    } 

    const product = {...prodData, minStock: Number(prodData.minStock), 
        lastPrice: Number(prodData.lastPrice), 
        stockedQuantities: prodData.stockedQuantities.map(sq => ({...sq, quantity: Number(sq.quantity)})),
        movements: prodData.movements.map(m => ({...m, quantity: Number(m.quantity)})),
    };

    return product;
};

export const getProductsCsvToJsonService = async (fileBuffer: Buffer) => {

    const forcedHeaders = [
    "name",
    "codebar",
    "description",
    "lastPrice",
    "minStock",
    "measurement",
    "categoryId"
    ];

  const json = await csv({
    trim: true,
    ignoreEmpty: false,
    headers: forcedHeaders,
    colParser: {
        name: "string",

        codebar: item => item.trim() === "" ? null : item.trim(),

        measurement: item => item.trim() === "" ? null : item.trim().toUpperCase(),

        lastPrice: item => {
            if (!item) return null;

            // 1. remove tudo que não é número ou vírgula
            const cleaned = item.replace(/[^0-9,]/g, "");

            // 2. troca vírgula por ponto
            const normalized = cleaned.replace(",", ".");

            // 3. transforma em número
            const num = Number(normalized);

            return isNaN(num) ? null : num;
        },

        categoryId: (item) => {
            const v = item.trim();

            if (v === "") return null;         // vazio → null
            if (!/^\d+$/.test(v)) return null; // não é número → null

            return Number(v);
            },

        minStock: "number",
        
        description: "string",
    }
  }).fromString(fileBuffer.toString("utf-8"))

    if(json.length === 0){
        throw new Error("O arquivo CSV está vazio ou não pôde ser parseado.");
    }
    

  const products = json.map((product) => {
    const parsedProduct = registerProductSchema.safeParse(product);
    if (!parsedProduct.success) {

        const errors = JSON.parse(parsedProduct.error.message);
        console.error(`Erro de validação para o produto: ${JSON.stringify(product)}`, parsedProduct.error);
        return { success: false, errors: errors, data: product }
    }
    return { success: true, errors: [], data: product }
  });

  return products;
};
   

export const createProductService = async (productData: ProductCreateInput) => {

    if(productData.codebar !==  null){
        const exists = await prisma.product.findFirst({
            where: { codebar: productData.codebar }
        });
    
        if (exists) throw new Error("Esse código de barras já está em uso.");
    }

    const formattedProductData = { ...productData, createdAt: new Date()};

    const newProduct = await prisma.product.create({
        data: formattedProductData
    });

    if(!newProduct){
        throw new Error('Erro ao criar produto');
    }
    console.log(newProduct)
    return {...newProduct, minStock: Number(newProduct.minStock), lastPrice: Number(newProduct.lastPrice)} as iProduct;
};

export const createProductsListService = async (productsData: ProductCreateInput[]) => {
    
    const newProducts = await prisma.$transaction(async (tx) => {
        
        const createdProducts = [];

        for (const product of productsData) {

            if (product.codebar !== null) {
                const exists = await tx.product.findFirst({
                    where: { codebar: product.codebar }
                });

                if (exists) {
                    throw new Error(`O código de barras vinculado ao produto ${product.name} (código ${product.codebar}) já está em uso.`);
                }
            }
            
            const newProduct = await tx.product.create({
                data: product
            });
            
            createdProducts.push(newProduct);
        }
        
        return createdProducts; 
    });
    
    return newProducts
}


export const updateProductService = async (productId: number, newProductProps: ProductUpdateInput) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if(!existingProduct) throw new Error('Produto não encontrado');

    if(newProductProps.codebar !== null){
        const exists = await prisma.product.findFirst({
            where: { codebar: newProductProps.codebar, NOT: { id: productId } }
        });

        if (exists) throw new Error("Esse código de barras já está em uso.");
    }
  
    


    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {...newProductProps, codebar: newProductProps.codebar === '' || newProductProps.codebar === null ? {set: null}: newProductProps.codebar, updatedAt: new Date()}
    });

    if(!updatedProduct){
        throw new Error('Erro ao atualizar produto');
    }

    return {...updatedProduct, minStock: Number(updatedProduct.minStock)} as iProduct;
};


export const deleteProductService = async (productId: number) => {

    const stockedProducts = await prisma.stockedProduct.findFirst({
        where: { productId: productId, quantity: { gt: 0 } }
    });

    if(stockedProducts){
        throw new Error('Não é possível deletar um produto que está armazenado em algum estoque.');
    }
    
    const result = await prisma.product.delete({
        where: { id: productId }
    })
    

    if(!result){
        throw new Error('Erro ao deletar produto');
    }

    return result;
};

    