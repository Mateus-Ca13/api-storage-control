export interface iProduct {
    id: string
    name: string
    measurement: ProductMeasurementType
    description: string
    codebar: string | null
    categoryId: string | null
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
  categoryId?: string;
  isBelowMinStock?: string;
  orderBy?: 'asc' | 'desc';
  sortBy?: 'name' | 'categoryId' | 'quantity';
}