export interface iStock {
    id: number
    name: string
    type: StockTypeType
    status: StockStatusType
    createdAt: Date
    updatedAt?: Date
}

export const StockTypeTuple = ["CENTRAL" , "SECONDARY"] as const; 
export type StockTypeType = (typeof StockTypeTuple)[number];
export const StockStatusTuple = ["ACTIVE" , "MAINTENANCE" , "INACTIVE"] as const;
export type StockStatusType = (typeof StockStatusTuple)[number];


export interface  iStocksFilters {
    offset: number;
    limit: number;
    name?: string;
    type?: StockTypeType;
    status?: StockStatusType;
    orderBy?: 'asc' | 'desc';
    sortBy?: 'name' | 'type' | 'status';
}
export type StockCreateInput = Omit<iStock, 'id' | 'createdAt' | 'updatedAt'>;
export type StockUpdateInput = Partial<Omit<iStock, 'id' | 'createdAt' | 'updatedAt'>>;