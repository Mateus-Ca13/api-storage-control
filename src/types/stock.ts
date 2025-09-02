export interface iStock {
    id: string
    name: string
    type: StockType
    status: StockStatusType
}

type StockType = "CENTRAL" | "SECONDARY"
type StockStatusType = "ACTIVE" | "MAINTENANCE" | "INACTIVE"
