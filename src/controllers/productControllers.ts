import { Request, Response } from 'express';
import { createProductService, deleteProductService, getAllProductsService, getProductByIdService, updateProductService } from '../services/productServices';
import { sendErrorResponse, sendResponse } from '../utils/response';
import { Product } from '../../generated/prisma';
import { registerProductSchema, updateProductSchema } from '../schemas/productsSchema';
import { iProduct, ProductCreateInput, ProductUpdateInput } from '../types/product';
import z from 'zod';


export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const { offset = "0", limit = "10", name, categoryId, isBelowMinStock, orderBy, sortBy } = req.query;

    console.log(req.query);
    const productsList = await getAllProductsService({
      offset: Number(offset),
      limit: Number(limit),
      name: name as string | undefined,
      categoryId: categoryId as string | undefined,
      isBelowMinStock: isBelowMinStock as string | undefined,
      orderBy: orderBy as 'asc' | 'desc',
      sortBy: sortBy as 'name' | 'categoryId' | 'quantity' | undefined,
    });
    sendResponse(res, productsList, 'Lista de produtos retornada com sucesso', true, 200);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};


export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product : Product = await getProductByIdService(id);
    sendResponse(res, product, 'Produto retornado com sucesso', true, 200);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};


export const createProductController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const productData: ProductCreateInput = registerProductSchema.parse(req.body);
    const returnProduct: iProduct = await createProductService(productData);
    sendResponse(res, returnProduct, 'Produto criado com sucesso', true, 201);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};


export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newProductProps: ProductUpdateInput = updateProductSchema.parse(req.body);

    const updatedProduct: iProduct = await updateProductService(id, newProductProps);
    sendResponse(res, updatedProduct, 'Produto atualizado com sucesso', true, 200);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};


export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteProductService(id);
    sendResponse(res, result, 'Produto deletado com sucesso', true, 200);
    
  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};
    