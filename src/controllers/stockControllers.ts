import { registerOrUpdateStockSchema } from "../schemas/stocksSchema";
import { createStockService, deleteStockService, getAllStocksService, getStockByIdService, updateStockService } from "../services/stockServices";
import { StockCreateInput, StockTypeType, StockUpdateInput } from "../types/stock";
import { sendErrorResponse, sendResponse } from "../utils/response";
import { Request, Response } from 'express';

export const getAllStocksController = async (req: Request, res: Response)=> {
    try{
        const { offset = "0", limit = "10", name, orderBy, sortBy, type } = req.query;
        const result = await getAllStocksService({
          limit: Number(limit),
          offset: Number(offset),
          name: name as string | undefined,
          orderBy: orderBy as 'asc' | 'desc',
          sortBy: sortBy as 'name' | 'type' | 'status' ,
          type: type as StockTypeType | undefined,


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
    const stockData: StockCreateInput = registerOrUpdateStockSchema.parse(req.body);
    try{
        const result = await createStockService(stockData);
        sendResponse(res, result, 'Estoque criado com sucesso', true, 200);
    } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
}

export const updateStockController = async (req: Request, res: Response)=> {
    try{
        const { id } = req.params;
        const stockData: StockUpdateInput = registerOrUpdateStockSchema.parse(req.body);
        
        const result = await updateStockService(Number(id), stockData);
        sendResponse(res, result, 'Estoque atualizado com sucesso', true, 200);
    } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
}

export const deleteStockController = async (req: Request, res: Response)=> {
    try{
        const { id } = req.params;
        const result = await deleteStockService(Number(id));
        sendResponse(res, result, 'Estoque deletado com sucesso', true, 200);
    } catch (error: unknown) {
    sendErrorResponse(res, error, 500);
  }
}
