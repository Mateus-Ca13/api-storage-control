export interface iUser {
    name: string
    username: string
    email: string
    role: UserRoleType
    password: string
    createdAt: Date
}

export const UserRoleTuple = ["USER", "ADMIN", "SUPER_ADMIN"] as const;
export type UserRoleType = (typeof UserRoleTuple)[number];
export type UserCreateInput = Omit<iUser, "id" | "createdAt">;
export type UserLoginInput = Pick<iUser, "email" | "password">;