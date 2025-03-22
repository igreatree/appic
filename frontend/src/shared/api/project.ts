import { Api } from "@shared/api";
import { BadRequestType, NotFoundRequestType } from "@shared/types";
import { AxiosError } from "axios";
import { ProjectType } from "@shared/types/project";

export type CreateProjectResponseType = {
    data: ProjectType | BadRequestType
    status: number
}

export type GetProjectsResponseType = {
    data: ProjectType[]
    status: number
}

export type ProjectResponseType = {
    data: ProjectType | NotFoundRequestType
    status: number
}

export const createProject = async (project: Omit<ProjectType, "id" | "lastUpdate">): Promise<CreateProjectResponseType> => {
    try {
        const response = await Api.post<ProjectType>(
            "projects",
            project,
        );
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as CreateProjectResponseType;

        return { data, status };
    }
};

export const updateProject = async (project: Omit<Partial<ProjectType>, "lastUpdate">): Promise<ProjectResponseType> => {
    try {
        const response = await Api.put<ProjectType>(
            "projects",
            project,
        );
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as ProjectResponseType;

        return { data, status };
    }
};

export const getProject = async (id: number): Promise<ProjectResponseType> => {
    try {
        const response = await Api.get<ProjectType>("projects", { params: { id } });
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as ProjectResponseType;

        return { data, status };
    }
};

export const getProjects = async (): Promise<GetProjectsResponseType> => {
    try {
        const response = await Api.get<ProjectType[]>("projects/all");
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as GetProjectsResponseType;

        return { data, status };
    }
};

export const deleteProject = async (id: number): Promise<ProjectResponseType> => {
    try {
        const response = await Api.delete<ProjectType>("projects", { params: { id } });
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as ProjectResponseType;

        return { data, status };
    }
};