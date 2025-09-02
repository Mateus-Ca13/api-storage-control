import { Request, Response } from 'express';
import { getMainSummaryService, getProductsSummaryService } from '../services/dashboardServices';
import { sendErrorResponse, sendResponse } from '../utils/response';

export const getMainSummaryController = async (req: Request, res: Response) => {
    try {
        const result = await getMainSummaryService()
        sendResponse(res, result, 'Resumo principal retornado com sucesso', true, 200);

    } catch (error: unknown) {
        sendErrorResponse(res, error, 500);
    }
    
};

export const getProductsSummaryController = async (req: Request, res: Response) => {
    try {
        const result = await getProductsSummaryService()
        sendResponse(res, result, 'Resumo de produtos retornado com sucesso', true, 200);

    } catch (error: unknown) {
        sendErrorResponse(res, error, 500);
    }
};

export const getStocksSummaryController = async (req: Request, res: Response) => {
    
};

export const getMovementsSummaryController = async (req: Request, res: Response) => {
    
};

export const getUsersSummaryController = async (req: Request, res: Response) => {
    
};