export interface iProduct {
    id: number
    name: string
    measurement: ProductMeasurementType
    description: string
    codebar: string | null
    lastPrice: number | null
    categoryId: number | null
    createdAt: Date;
    minStock: number
    isBelowMinStock: boolean
}

export const ProductMeasurementTuple = ["UN" , "KG" , "L" , "M"] as const; 
export type ProductMeasurementType = (typeof ProductMeasurementTuple)[number];
export type ProductCreateInput = Omit<iProduct, 'id' | 'createdAt' | 'isBelowMinStock'>;
export type ProductUpdateInput = Partial<Omit<iProduct, 'id' | 'createdAt' | 'isBelowMinStock'>>;

export interface iProductsFilters {
  offset: number;
  limit: number;
  name?: string;
  categoriesIds?: number[];
  isBelowMinStock?: string;
  orderBy?: 'asc' | 'desc';
  sortBy?: 'name' | 'categoryId' | 'stockedQuantities';
  hasNoCodebar?: string;

}