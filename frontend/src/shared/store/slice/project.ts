import { Optional } from "@shared/types";
import { ProjectType } from "@/shared/types/project";
import { StateCreator } from "zustand";

export type ProjectSliceType = Optional<ProjectType, "id" | "content">;

export const projectSlice: StateCreator<ProjectSliceType> = () => ({
    id: undefined,
    title: "",
    description: "",
    content: undefined,
    lastUpdate: new Date,
});