import { Outlet } from "react-router";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "@components/Header";

export default function Layout() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <Header opened={opened} toggle={toggle} />
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}