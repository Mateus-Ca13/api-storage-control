export interface iMovementBatch {
    id: string
    type: MovementBatchType
    originStockId: string | null
    destinationStockId: string | null
    observations: string
    createdAt: Date
}

type MovementBatchType = "ENTRY" | "EXIT" | "TRANSFER"