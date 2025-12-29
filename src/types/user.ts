export interface iUser {
    id: number
    name: string
    username: string
    email: string
    role: UserRoleType
    password: string
    createdAt: Date
    updatedAt?: Date
}

export interface iUserPayload {
    id: number;
    username: string;
    email: string;
    role: string;
}

export const UserRoleTuple = ["USER", "ADMIN", "SUPER_ADMIN"] as const;
export type UserRoleType = (typeof UserRoleTuple)[number];
export type UserCreateInput = Omit<iUser, "id" | "createdAt" | "updatedAt">;
export type UserUpdateInput = Partial<Omit<iUser, "id" | "createdAt" | "updatedAt">>;
export type UserUpdatePasswordInput = Pick<iUser, "password">;
export type UserLoginInput = Pick<iUser, "username" | "password">;


export interface iUsersFilters {
    offset: number;
    limit: number;
    name?: string;
    orderBy?: 'asc' | 'desc';
    sortBy?: 'name' | 'role';
}