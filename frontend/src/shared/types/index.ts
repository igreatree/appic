export type BadRequestType = {
    message: string
    error: string
    statusCode: number
}

export type NotFoundRequestType = {
    status: number
    message: string
}

export type UnauthorizedRequestType = {
    statusCode: number
    message: string
}

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