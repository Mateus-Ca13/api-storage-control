import { createStockService, deleteStockService, getAllStocksService, getStockByIdService, updateStockService } from "../services/stockServices";
import { sendErrorResponse, sendResponse } from "../utils/response";
import { Request, Response } from 'express';

export const getAllStocksController = async (req: Request, res: Response)=> {
    try{
        const { offset = "0", limit = "10", name, orderBy, sortBy } = req.query;
        const result = await getAllStocksService({
          limit: Number(limit),
          offset: Number(offset),
          name: name as string | undefined,
          orderBy: orderBy as 'asc' | 'desc',
          sortBy: sortBy as 'name' | 'type' | 'status' 

        });
        sendResponse(res, result, 'Lista de estoques retornada com sucesso', true, 200);
    } catch (error: unknown) {
        sendErrorResponse(res, error, 500);
      }
}

export const getStockByIdController = async (req: Request, res: Response)=> {
    try{
        const { id } = req.params;
        const result = await getStockByIdService(Number(id));
        sendResponse(res, result, 'Estoque retornado com sucesso', true, 200);
    } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
}

export const createStockController = async (req: Request, res: Response)=> {
    try{
        const result = await createStockService();
        sendResponse(res, result, 'Estoque criado com sucesso', true, 200);
    } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
}

export const updateStockController = async (req: Request, res: Response)=> {
    try{
        const { id } = req.params;
        const result = await updateStockService();
        sendResponse(res, result, 'Estoque atualizado com sucesso', true, 200);
    } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
}

export const deleteStockController = async (req: Request, res: Response)=> {
    try{
        const { id } = req.params;
        const result = await deleteStockService();
        sendResponse(res, result, 'Estoque deletado com sucesso', true, 200);
    } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
}
