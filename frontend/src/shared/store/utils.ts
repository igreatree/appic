import { ProjectType } from "@shared/types/project";
import { useProjectStore } from ".";

export const getProjectState = () => {
    const { id, title, description, content, lastUpdate } = useProjectStore.getState();
    return { id, title, description, content, lastUpdate } as ProjectType;
};