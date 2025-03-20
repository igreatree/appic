import { Api } from "@shared/api";
import { BadRequestType } from "@shared/types";
import { AxiosError } from "axios";
import { UserType, UserTypeWithToken } from "@shared/types/user";

export type LoginResponseType = {
    data: UserTypeWithToken | BadRequestType
    status: number
}

export type RegisterResponseType = {
    data: UserType | BadRequestType
    status: number
}

export type AuthPropsType = { email: string, password: string };

export const login = async ({ email, password }: AuthPropsType): Promise<LoginResponseType> => {
    try {
        const response = await Api.post<UserTypeWithToken>(
            "auth/login",
            {
                email, password
            },
        );
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as LoginResponseType;

        return { data, status };
    }
};

export const register = async ({ email, password }: AuthPropsType): Promise<RegisterResponseType> => {
    try {
        const response = await Api.post<UserType>(
            "auth/register",
            {
                email, password
            },
        );
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as LoginResponseType;

        return { data, status };
    }
};

export const authCheck = async (): Promise<RegisterResponseType> => {
    try {
        const response = await Api.get<UserType>("users/check");
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as LoginResponseType;

        return { data, status };
    }
};