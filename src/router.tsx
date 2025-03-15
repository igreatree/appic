import { createBrowserRouter } from "react-router-dom";
import { ProjectList } from "@pages/ProjectList";
import { ErrorPage } from "@pages/ErrorPage";
import Layout from "@/layouts/Layout";
import { Project } from "@pages/Project";
import { Settings } from "@pages/Settings";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    element: <ProjectList />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "/:projectId",
                    element: <Project />,
                    errorElement: <ErrorPage />,
                },
                {
                    path: "/:projectId/settings",
                    element: <Settings />,
                    errorElement: <ErrorPage />,
                },
            ]
        },
    ],
    // {
    //     async patchRoutesOnNavigation({ matches }) {
    //         if (matches.length) {
    //             logic
    //         }
    //     },
    //     basename: import.meta.env.VITE_BASE_URL,
    //     future: {
    //         v7_relativeSplatPath: true,
    //         v7_fetcherPersist: true,
    //         v7_normalizeFormMethod: true,
    //         v7_partialHydration: true,
    //         v7_skipActionErrorRevalidation: true,
    //     },
    // }
);
