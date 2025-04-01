import { AppShell, Burger, Divider, Group, Menu, Title } from "@mantine/core";
import { Image, Text } from "@mantine/core";
import LogoImage from "@assets/images/logo.svg";
import SignoutIcon from "@assets/icons/signout.svg";
import MailIcon from "@assets/icons/mail.svg";
import { Breadcrumbs } from "@components/Breadcrumbs";
import { useAuth } from "@components/AuthProvider";
import { useProjectStore } from "@shared/store";

type HeaderPropsType = {
    opened: boolean;
    toggle: () => void;
    projectId?: string;
}

const pathNames: { [key: string]: string } = {
    settings: "Settings",
    objects: "Objects",
}

export const Header = ({ opened, toggle, projectId }: HeaderPropsType) => {
    const { user, logout } = useAuth();
    const { title } = useProjectStore();
    const path = window.location.pathname.replaceAll("/", "").replace(`${projectId}`, "");
    const breadcrumbsItems = [{ title: "Projects", href: "/" }];
    path && breadcrumbsItems.push({ title: title, href: `/${projectId}` });
    const isProjectOpened = projectId && !path;
    const headerTitle = window.location.pathname === "/" ? "" : path ? pathNames[path] : title;

    return (
        <AppShell.Header pl="sm" pr="sm">
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
                <Title order={5} fw={400}>{headerTitle}</Title>
                {user && (
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Group gap={4} style={{ cursor: "pointer" }}>
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
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>{user.email}</Menu.Label>
                            <Menu.Item
                                leftSection={<Image src={SignoutIcon} />}
                                onClick={logout}
                            >
                                Logout
                            </Menu.Item>
                            <Divider />
                            <Menu.Label>Contacts:</Menu.Label>
                            <Menu.Item
                                leftSection={<Image src={MailIcon} />}
                                onClick={() => location.href = "mailto:i@gaibullaev.ru"}
                            >
                                i@gaibullaev.ru
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                )}
            </Group>
        </AppShell.Header>
    )
}