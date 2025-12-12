import prisma from "../lib/prismaClient";
import { CategoryCreateInput, CategoryUpdateInput, iCategoryFilters } from "../types/category"


export const getAllCategoriesService = async (categoryFilters: iCategoryFilters) => {
    const { offset, limit, name, orderBy, sortBy } = categoryFilters;
    const orderField = sortBy ?? 'name';

    const [resultData, total] = await Promise.all([
        prisma.category.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            skip: offset,
            take: limit,
            orderBy: {
                [orderField]: orderBy || 'asc',
            },
            select: {
                id: true,
                name: true,
                colorPreset: true,
                _count: {
                    select: {
                        products: true,
                    },
                },
                
            },
        }),
        prisma.category.count()
    ])

    const categories = resultData.map((c) => ({
        id: c.id,
        name: c.name,
        colorPreset: c.colorPreset,
        linkedProducts: c._count.products,
    }))

    return {
        pagination: {
            total,
            offset,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        categories: categories
    }
     
}

export const getCategoryByIdService = async (id: number) => {
    const data = await prisma.category.findUnique({
        where: { id: id },
        include: { products: {select: {
            id: true,
            name: true,
            codebar: true,
            lastPrice: true,
            minStock: true,
            measurement: true,
            isBelowMinStock: true,
            stockedQuantities: {
                select: {
                    quantity: true,
                }
            },
        }} }
    });

    if(!data){
        throw new Error('Categoria não encontrada');
    }

    const category = {
        ...data,
        products: data.products.map((p) => ({
            ...p,
            stockedQuantities: p.stockedQuantities.reduce((sum, sq) => sum + Number(sq.quantity), 0),
        })),
    }

    return category;
}

export const createCategoryService = async (categoryData: CategoryCreateInput) => {
    
    const newCategory = await prisma.category.create({
        data: categoryData
    });

    if(!newCategory){
        throw new Error('Erro ao criar categoria');
    }

    return newCategory;
}

export const updateCategoryService = async (CategoryId: number, categoryData: CategoryUpdateInput) => {
    
    const updatedCategory = await prisma.category.update({
        where: { id: CategoryId },
        data: {...categoryData, updatedAt: new Date()}
    });

    if(!updatedCategory){
        throw new Error('Erro ao atualizar categoria');
    }

    return updatedCategory
}

export const deleteCategoryService = async (categoryId: number) => {
    
    const deletedCategory = await prisma.category.delete({
        where: { id: categoryId }
    });

    if(!deletedCategory){
        throw new Error('Erro ao deletar categoria');
    }

    return deletedCategory;

    
}