import { Image, Stack, ActionIcon, Loader, Button, Text, Box } from "@mantine/core";
import PlusIcon from "@assets/icons/plus-light.svg";
import { useEffect, useState } from "react";
import { ProjectGrid } from "./ui/ProjectGrid";
import { getProjects } from "@shared/api/project";
import { ProjectType } from "@shared/types/project";
import { useDisclosure } from "@mantine/hooks";
import theme from "@/theme.module.scss";
import styles from "./projectList.module.scss";
import { ModalProjectCreate } from "./ui/ModalProjectCreate";

export const ProjectList = () => {
    const [projects, setProjects] = useState<ProjectType[] | null>(null);
    const [opened, { open, close }] = useDisclosure();

    useEffect(() => {
        const getData = async () => {
            const { status, data } = await getProjects();
            if (status === 200) setProjects(data);
        };
        getData();
    }, []);

    return (
        <Stack p="md">
            <ActionIcon title="Create project" onClick={open}><Image src={PlusIcon} /></ActionIcon>
            <ModalProjectCreate
                opened={opened}
                close={close}
                onSuccess={(p) => setProjects(prev => prev ? [...prev, p] : [p])}
            />
            {projects ?
                projects.length > 0 ?
                    <ProjectGrid projects={projects} />
                    :
                    <Stack className={styles.center}>
                        <Text ta="center">You don't have any projects yet!</Text>
                        <Button color={theme.primary} onClick={open}>Create</Button>
                    </Stack>
                :
                <Box className={styles.center}><Loader color={theme.primary} /></Box>
            }
        </Stack>
    )
}