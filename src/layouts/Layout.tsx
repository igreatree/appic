import { Outlet } from "react-router";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "@components/Header";
import variables from "@/theme.module.scss";

export default function Layout() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: variables.headerHeight }}
        >
            <Header opened={opened} toggle={toggle} />
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}