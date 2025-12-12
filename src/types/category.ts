export interface iCategory {
    id: number
    name: string
    colorPreset: number
    createdAt: Date
    updatedAt?: Date
}

export type CategoryCreateInput = Omit<iCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type CategoryUpdateInput = Partial<Omit<iCategory, 'id' | 'createdAt' | 'updatedAt'>>;

export interface iCategoryFilters {
    offset: number;
    limit: number;
    name?: string;
    orderBy?: 'asc' | 'desc';
    sortBy?: 'name';
}