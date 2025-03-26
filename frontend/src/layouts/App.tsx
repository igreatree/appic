import { Outlet, useParams } from "react-router";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "@components/Header";
import { Toolbar } from "@components/Toolbar";
import { PrivateLayout } from "./PrivateLayout";
import variables from "@/theme.module.scss";

export default function App() {
    const [opened, { toggle }] = useDisclosure();
    const { projectId } = useParams();
    const path = window.location.pathname.replaceAll("/", "").replace(`${projectId}`, "");
    const isProjectOpened = projectId && !path;

    return (
        <PrivateLayout>
            <AppShell
                header={{ height: variables.headerHeight }}
                navbar={{
                    width: isProjectOpened ? 180 : 0,
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened, desktop: !opened },
                }}
            >
                <Header projectId={projectId} opened={opened} toggle={toggle} />
                <AppShell.Main pl={0}>
                    <Outlet />
                    {isProjectOpened && <Toolbar projectId={projectId} />}
                </AppShell.Main>
            </AppShell>
        </PrivateLayout>
    );
}