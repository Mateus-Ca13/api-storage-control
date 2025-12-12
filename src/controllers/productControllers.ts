import { Request, Response } from 'express';
import { createProductService, createProductsListService, deleteProductService, getAllProductsService, getProductByCodebarService, getProductByIdService, getProductsCsvToJsonService, updateProductService } from '../services/productServices';
import { sendErrorResponse, sendResponse } from '../utils/response';
import { registerProductSchema, updateProductSchema } from '../schemas/productsSchema';
import { ProductCreateInput, ProductUpdateInput } from '../types/product';

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const { offset = "0", limit = "10", name, categoriesIds, stockId, isBelowMinStock, orderBy, sortBy, hasNoCodebar } = req.query;
    const productsList = await getAllProductsService({
      offset: Number(offset),
      limit: Number(limit),
      stockId: stockId ? Number(stockId) : undefined,
      name: name as string | undefined,
      categoriesIds: typeof categoriesIds === "string" ? (JSON.parse(categoriesIds) as number[]): undefined,
      isBelowMinStock: isBelowMinStock as string | undefined,
      orderBy: orderBy as 'asc' | 'desc',
      sortBy: sortBy as 'name' | 'categoryId' | 'stockedQuantities' | undefined,
      hasNoCodebar: hasNoCodebar as string | undefined,
    });
    sendResponse(res, productsList, 'Lista de produtos retornada com sucesso', true, 200);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};


export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(Number(id));
    sendResponse(res, product, 'Produto retornado com sucesso', true, 200);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};

export const getProductByCodebarController = async (req: Request, res: Response) => {
  try {
    const { codebar } = req.params;
    const stockId = req.query.stockId as string | undefined;
    const product = await getProductByCodebarService(codebar, stockId ? Number(stockId) : undefined);
    sendResponse(res, product, 'Produto retornado com sucesso', true, 200);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};

export const getProductsCsvToJsonController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, "Nenhum arquivo enviado", 400);
    }

    const data = await getProductsCsvToJsonService(req.file.buffer);

    return sendResponse(res, data, 'Produtos importados com sucesso', true, 200);
  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }

}

export const createProductController = async (req: Request, res: Response) => {
  try {
    const productData: ProductCreateInput = registerProductSchema.parse(req.body);
    const returnProduct = await createProductService(productData);
    sendResponse(res, returnProduct, 'Produto criado com sucesso', true, 201);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};

export const createProductsListController = async (req: Request, res: Response) => {
  try {
    const productsData: ProductCreateInput[] = req.body;
    for (const product of productsData) {
        registerProductSchema.parse(product);
    }
    const returnProducts = await createProductsListService(productsData)
    sendResponse(res, returnProducts, 'Produtos criados com sucesso', true, 201);
    
  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};


export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newProductProps: ProductUpdateInput = updateProductSchema.parse(req.body);
    const updatedProduct = await updateProductService(Number(id), newProductProps);
    sendResponse(res, updatedProduct, 'Produto atualizado com sucesso', true, 200);

  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};


export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteProductService(Number(id));
    sendResponse(res, result, 'Produto deletado com sucesso', true, 200);
    
  } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
};
    