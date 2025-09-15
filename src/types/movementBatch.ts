export interface iMovementBatch {
    id: number
    type: MovementBatchType
    originStockId: number | null
    destinationStockId: number | null
    observations: string
    createdAt: Date
}

type MovementBatchType = "ENTRY" | "EXIT" | "TRANSFER"