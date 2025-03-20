
export type UserType = {
    id: string
    email: string
    role: "User" | "Admin"
}

export type UserTypeWithToken = {
    id: string
    email: string
    role: "User" | "Admin"
} & {
    access_token: string
}