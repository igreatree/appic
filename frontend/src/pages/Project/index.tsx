import { getProject } from "@shared/api/project";
import { Stack } from "@mantine/core";
import { data, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { NotFoundRequestType } from "@shared/types";
import { ProjectType } from "@shared/types/project";
import { getProjectState } from "@shared/store/utils";
import { useProjectStore } from "@shared/store";

export const projectLoader = async ({ params }: LoaderFunctionArgs) => {
    const projectState = getProjectState();
    if (projectState.id !== Number(params.projectId)) {
        console.log("%c project from server", "color:orange; font-size:11px;");
        const { status, data: project } = await getProject(Number(params.projectId));
        if (status === 200) {
            useProjectStore.setState(project as ProjectType);
            return { project };
        } else {
            throw data((project as NotFoundRequestType).message, 404);
        }
    } else {
        console.log("%c project from store", "color:green; font-size:11px;");
        return { project: projectState }
    }
};

export const Project = () => {
    const { project } = useLoaderData<{ project: ProjectType }>();

    return (
        <Stack p="md">
            {JSON.stringify(project, null, " ")}
        </Stack>
    )
};