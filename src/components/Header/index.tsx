import { AppShell, Burger, Group } from "@mantine/core";
import { Image, Text } from "@mantine/core";
import LogoImage from "@assets/images/logo.svg";
import { Breadcrumbs } from "@components/Breadcrumbs";

type HeaderPropsType = {
    opened: boolean;
    toggle: () => void;
    projectId?: string;
}

const pathNames: { [key: string]: string } = {
    settings: "Settings",
    objects: "Objetcs",
}

export const Header = ({ opened, toggle, projectId }: HeaderPropsType) => {
    const path = window.location.pathname.replaceAll("/", "").replace(`${projectId}`, "");
    const breadcrumbsItems = [{ title: "Projects", href: "/" }];
    path && breadcrumbsItems.push({ title: "Project", href: `/${projectId}` });
    const isProjectOpened = projectId && !path;

    return (
        <AppShell.Header pl="sm" pr="sm" h={60}>
            <Group h="100%" justify="space-between" align="center">
                <Group gap={0}>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        size="sm"
                        w={isProjectOpened ? "30px" : "0px"}
                        p={"0px"}
                        style={{ transition: "width .3s ease-in-out", overflow: "hidden" }}
                    />
                    <Breadcrumbs items={breadcrumbsItems} />
                </Group>
                {projectId && <Text size="xl">{path ? pathNames[path] : "Project"}</Text>}
                <Group gap={4}>
                    <Image w={30} src={LogoImage} alt="logo" title="Appic" />
                    <Text
                        style={{
                            transition: "width .3s ease-in-out",
                            overflow: "hidden"
                        }}
                        size={"24px"}
                        w={!projectId ? "60px" : "0px"}
                    >
                        appic
                    </Text>
                </Group>
            </Group>
        </AppShell.Header>
    )
}