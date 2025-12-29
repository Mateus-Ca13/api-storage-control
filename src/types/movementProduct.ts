export interface iMovementProduct{
    productId: number
    movementBatchId: number
    quantity: number
    pricePerUnit: number | null
}

export interface iCreateMovementProduct {
    productId: number
    quantity: number
    pricePerUnit: number | null
}