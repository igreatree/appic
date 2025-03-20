import { createBrowserRouter } from "react-router-dom";
import { ProjectList } from "@pages/ProjectList";
import { ErrorPage } from "@pages/ErrorPage";
import App from "@/layouts/App";
import { Project, projectLoader } from "@pages/Project";
import { Settings } from "@pages/Settings";
import { Login } from "@pages/Login";
import { Registration } from "@pages/Registration";
import { Objects } from "@pages/Objects";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
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
                    loader: projectLoader,
                    errorElement: <ErrorPage />,
                    children: [
                        {
                            path: "/:projectId/settings",
                            element: <Settings />,
                            errorElement: <ErrorPage />,
                        },
                        {
                            path: "/:projectId/objects",
                            element: <Objects />,
                            errorElement: <ErrorPage />,
                        },
                    ]
                },
            ]
        },
        {
            path: "/login",
            element: <Login />,
            errorElement: <ErrorPage />,
        },
        {
            path: "/registration",
            element: <Registration />,
            errorElement: <ErrorPage />,
        }
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
