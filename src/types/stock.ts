export interface iStock {
    id: number
    name: string
    type: StockType
    status: StockStatusType
}

type StockType = "CENTRAL" | "SECONDARY"
type StockStatusType = "ACTIVE" | "MAINTENANCE" | "INACTIVE"


export interface  iStocksFilters {
    offset: number;
    limit: number;
    name?: string;
    type?: StockType;
    status?: StockStatusType;
    orderBy?: 'asc' | 'desc';
    sortBy?: 'name' | 'type' | 'status';
}