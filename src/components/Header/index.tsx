import { AppShell, Burger, Group } from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import { Image, Text } from "@mantine/core";
import LogoImage from "@assets/images/logo.svg";

type HeaderPropsType = {
    opened: boolean;
    toggle: () => void;
}

export const Header = ({ opened, toggle }: HeaderPropsType) => {
    const { projectId } = useParams();
    return (
        <AppShell.Header pl="sm" pr="sm">
            <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
            />
            <Group h="100%" justify="space-between" align="center">
                <Group>
                    {projectId && <>
                        <Link to="/">
                            Projects
                        </Link>
                        <Link to={`/${projectId}`}>
                            Project
                        </Link>
                        <Link to={`/${projectId}/settings`}>
                            Settings
                        </Link>
                    </>}
                </Group>
                <Link to="/">
                    <Group gap={4}>
                        <Image w={30} src={LogoImage} />
                        <Text size="xl">appic</Text>
                    </Group>
                </Link>
            </Group>
        </AppShell.Header>
    )
}