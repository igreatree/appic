import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { projectSlice, ProjectSliceType } from "./slice/project";

export const useProjectStore = create<ProjectSliceType>()(
  persist(
    (set, get, store) => ({
      ...projectSlice(set, get, store)
    }),
    {
      name: "appic-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);