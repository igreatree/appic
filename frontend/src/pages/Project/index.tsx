import { getProject } from "@shared/api/project";
import { Paper } from "@mantine/core";
import { data, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { NotFoundRequestType } from "@shared/types";

export const projectLoader = async ({ params }: LoaderFunctionArgs) => {
    const { status, data: project } = await getProject(Number(params.projectId));
    if (status === 200) {
        return { project };
    } else {
        throw data((project as NotFoundRequestType).message, 404);
    }
}

export const Project = () => {
    const { project } = useLoaderData();
    console.log({ project });
    return (
        <Paper>
        </Paper>
    )
}