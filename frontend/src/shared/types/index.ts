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