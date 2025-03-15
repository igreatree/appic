import { AppShell, Burger, Group } from "@mantine/core";
import { useParams } from "react-router-dom";
import { Image, Text } from "@mantine/core";
import LogoImage from "@assets/images/logo.svg";
import { Breadcrumbs } from "@components/Breadcrumbs";

type HeaderPropsType = {
    opened: boolean;
    toggle: () => void;
}

export const Header = ({ opened, toggle }: HeaderPropsType) => {
    const { projectId } = useParams();
    const isSettingsOpened = window.location.pathname.replace(`/${projectId}/`, "") === "settings";
    const breadcrumbsItems = [{ title: "Projects", href: "/" }];
    isSettingsOpened && breadcrumbsItems.push({ title: "Project", href: `/${projectId}` });
    return (
        <AppShell.Header pl="sm" pr="sm" h={60}>
            <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
            />
            <Group h="100%" justify="space-between" align="center">
                <Breadcrumbs items={breadcrumbsItems} />
                {projectId && <Text size="xl">{isSettingsOpened ? "Settings" : "Project"}</Text>}
                <Group gap={4}>
                    <Image w={30} src={LogoImage} />
                    <Text
                        style={{
                            transition: "width .3s ease-in-out",
                            overflow: "hidden"
                        }}
                        size="xl"
                        w={!projectId ? "50px" : "0px"}
                    >
                        appic
                    </Text>
                </Group>
            </Group>
        </AppShell.Header>
    )
}