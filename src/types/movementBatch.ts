import { iCreateMovementProduct } from "./movementProduct"

export interface iMovementBatch {
    id: number
    type: MovementBatchType
    originStockId: number | null
    destinationStockId: number | null
    observations: string
    userCreatorId: number
    createdAt: Date
}

export const MovementBatchTuple = ["ENTRY", "EXIT", "TRANSFER"] as const;
export type MovementBatchType = (typeof MovementBatchTuple)[number];


export type MovementCreateInput = Omit<iMovementBatch, 'id' | 'createdAt'> & { products: iCreateMovementProduct[] }
export type MovementUpdateInput = Pick<iMovementBatch, 'observations'>;

export interface iMovementFilters {
    offset: number;
    limit: number;
    name?: string;
    userId?: number;
    orderBy?: 'asc' | 'desc';
    sortBy?: 'createdAt' | 'type' | 'userCreator' ;
    type?: MovementBatchType;
    sentFrom: number | null;
    sentTo: number | null;

}