interface User {
    id: string
    name: string
    role: UserRoleType
}

type UserRoleType = 'VIEWER' | 'ADMIN'