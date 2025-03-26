import { Optional } from "@shared/types";
import { ImageType, ProjectType } from "@shared/types/project";
import { StateCreator } from "zustand";

type ProjectActions = {
    updateProjectContent: (data: Partial<ProjectType["content"]>) => void
    addProjectImage: (image: ImageType) => void
    updateProjectImage: (image: Partial<ImageType>) => void
    deleteProjectImage: (id: string) => void
};

export const initialProjectState = {
    title: "",
    description: "",
    content: {
        background: "/images/empty-room.jpg",
        images: [],
    }
};

export type ProjectSliceType = Optional<ProjectType, "id"> & ProjectActions;

export const projectSlice: StateCreator<ProjectSliceType> = (set) => ({
    ...initialProjectState,
    lastUpdate: new Date,
    addProjectImage: (image) => {
        set((state) => ({ ...state, content: { ...state.content, images: [...state.content.images, image] } }))
    },
    updateProjectContent: (data) => {
        set((state) => ({ ...state, content: { ...state.content, ...data } }))
    },
    updateProjectImage: (image) => {
        set((state) => {
            const updatedImages = state.content.images.map((i) => {
                if (i.id === image.id) {
                    return { ...i, ...image };
                }
                return i;
            });
            return { ...state, content: { ...state.content, images: updatedImages } }
        });
    },
    deleteProjectImage: (id: string) => {
        set((state) => {
            const updatedImages = state.content.images.filter((i) => i.id !== id);
            return { ...state, content: { ...state.content, images: updatedImages } }
        })
    }
});