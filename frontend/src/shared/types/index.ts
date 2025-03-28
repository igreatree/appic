export type BadRequestType = {
    message: string
    error: string
    statusCode: number
};

export type NotFoundRequestType = {
    status: number
    message: string
};

export type UnauthorizedRequestType = {
    statusCode: number
    message: string
};

export type Size = { width: number, height: number };

export type CropStatus = "started" | "finished" | "in" | "out" | "accept";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;