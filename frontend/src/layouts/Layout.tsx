import { Outlet, useParams } from "react-router";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "@components/Header";
import variables from "@/theme.module.scss";
import { Toolbar } from "@components/Toolbar";

export default function Layout() {
    const [opened, { toggle }] = useDisclosure();
    const { projectId } = useParams();
    const path = window.location.pathname.replaceAll("/", "").replace(`${projectId}`, "");
    const isProjectOpened = projectId && !path;

    return (
        <AppShell
            header={{ height: variables.headerHeight }}
            navbar={{
                width: isProjectOpened ? 240 : 0,
                breakpoint: 'sm',
                collapsed: { mobile: !opened, desktop: !opened },
            }}
        >
            <Header projectId={projectId} opened={opened} toggle={toggle} />
            <AppShell.Main>
                <Outlet />
                {isProjectOpened && <Toolbar projectId={projectId} />}
            </AppShell.Main>
        </AppShell>
    );
}