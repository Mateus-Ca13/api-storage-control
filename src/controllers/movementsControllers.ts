import { log } from "console";
import { movementRegisterSchema } from "../schemas/movementSchema";
import { createMovementService, deleteMovementService, getAllMovementsService, getMovementByIdService, updateMovementService } from "../services/movementsServices";
import { MovementBatchType } from "../types/movementBatch";
import { sendErrorResponse, sendResponse } from "../utils/response";
import { Request, Response } from "express";


export const getAllMovementsController = async (req: Request, res: Response) => {
    const { offset = "0", limit = "10", name, orderBy, sortBy, userId, type, sentFrom, sentTo } = req.query;
    try {
        const result = await getAllMovementsService({
          limit: Number(limit),
          offset: Number(offset),
          name: name as string | undefined,
          orderBy: orderBy as 'asc' | 'desc',
          sortBy: sortBy as 'createdAt' | 'type' | 'userCreator' | undefined,
          userId: Number(userId),
          type: type as MovementBatchType | undefined,
          sentFrom: Number(sentFrom) as number | null,
          sentTo: Number(sentTo) as number | null,
        });
        sendResponse(res, result, 'Lista de movimentações retornada com sucesso', true, 200);

    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};

export const getMovementByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await getMovementByIdService(Number(id));
        sendResponse(res, result, 'Movimentação retornada com sucesso', true, 200);
        
    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};

export const createMovementController = async (req: Request, res: Response) => {
    try {
        const movementData = movementRegisterSchema.parse(req.body);
        log(movementData);
        const result = await createMovementService(req.body);
        sendResponse(res, result, 'Movimentação criada com sucesso', true, 201);
        
    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};

export const updateMovementController = async (req: Request, res: Response) => {
    try {
        const result = await updateMovementService(Number(req.params.id), req.body);
        sendResponse(res, result, 'Movimentação atualizada com sucesso', true, 200);
        
    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};

export const deleteMovementController = async (req: Request, res: Response) => {
    try {
        const result = await deleteMovementService(Number(req.params.id));
        sendResponse(res, result, 'Movimentação deletada com sucesso', true, 200);
    } catch (error: unknown) {
      sendErrorResponse(res, error, 500);
    }
};
