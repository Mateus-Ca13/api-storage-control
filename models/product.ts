export interface Product {
    id: string
    name: string
    unitOfMeasure: UnitOfMeasureType
    description: string
    codebar: string
    categoryId: string
    createdAt: Date;
    updateAt: Date;
}

type UnitOfMeasureType = "UN" | "KG" | "G" | "L" | "ML" | "M" | "CM" | "ML" 