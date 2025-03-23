import { getProject } from "@shared/api/project";
import { Stack } from "@mantine/core";
import { data, LoaderFunctionArgs } from "react-router-dom";
import { NotFoundRequestType } from "@shared/types";
import { ProjectType } from "@shared/types/project";
import { getProjectState } from "@shared/store/utils";
import { useProjectStore } from "@shared/store";
import { ProjectCanvas } from "@components/ProjectCanvas";

export const projectLoader = async ({ params }: LoaderFunctionArgs) => {
    const projectState = getProjectState();
    if (projectState.id !== Number(params.projectId)) {
        console.log("%cProject from server", "color:orange; font-size:12px;");
        const { status, data: project } = await getProject(Number(params.projectId));
        if (status === 200) {
            useProjectStore.setState(project as ProjectType);
        } else {
            throw data((project as NotFoundRequestType).message, 404);
        }
    } else {
        console.log("%cProject from store", "color:green; font-size:12px;");
    }
};

export const Project = () => {
    const { content } = useProjectStore();

    return (
        <Stack>
            <ProjectCanvas content={content} />
        </Stack>
    )
};