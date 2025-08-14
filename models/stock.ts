export interface Stock {
    id: string
    name: string
    type: StockType
}

type StockType = "CENTRAL" | "SECONDARY"
