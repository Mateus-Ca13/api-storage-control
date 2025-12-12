import { registerOrUpdateCategorySchema } from "../schemas/categorySchemas";
import { createCategoryService, deleteCategoryService, getAllCategoriesService, getCategoryByIdService, updateCategoryService } from "../services/categoryServices";
import { CategoryUpdateInput } from "../types/category";
import { sendErrorResponse, sendResponse } from "../utils/response";
import { Request, Response } from "express";


export const getAllCategoriesController = async (req: Request, res: Response) => {
    const { offset = "0", limit = "10", name, orderBy, sortBy } = req.query;
    try {
        const result = await getAllCategoriesService({
          limit: Number(limit),
          offset: Number(offset),
          name: name as string | undefined,
          orderBy: orderBy as 'asc' | 'desc',
          sortBy: sortBy as 'name' | undefined,
        });
        sendResponse(res, result, 'Lista de categorias retornada com sucesso', true, 200);

    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await getCategoryByIdService(Number(id));
        sendResponse(res, result, 'Categoria retornada com sucesso', true, 200);
        
    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};

export const createCategoryController = async (req: Request, res: Response) => {
    try {
        const result = await createCategoryService(req.body);
        sendResponse(res, result, 'Categoria criada com sucesso', true, 201);
        
    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};

export const updateCategoryController = async (req: Request, res: Response) => {
    try {
        const categoryData: CategoryUpdateInput = registerOrUpdateCategorySchema.parse(req.body);
        const result = await updateCategoryService(Number(req.params.id), categoryData);
        sendResponse(res, result, 'Categoria atualizada com sucesso', true, 200);
        
    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
    try {
        const result = await deleteCategoryService(Number(req.params.id));
        sendResponse(res, result, 'Categoria deletada com sucesso', true, 200);
        
    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};
