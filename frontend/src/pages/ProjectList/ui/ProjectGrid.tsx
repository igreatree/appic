import { ProjectType } from "@shared/types/project";
import { Badge, Card, Image, SimpleGrid, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { getElapsedTime } from "@shared/utils";
import theme from "@/theme.module.scss";
import styles from "./projectGrid.module.scss";

type ProjectGridPropsType = {
    projects: ProjectType[]
}

const GridItem = ({ id, title, description, content, lastUpdate }: ProjectType) => {
    const navigate = useNavigate();
    const elapsedTime = getElapsedTime(lastUpdate);
    return (
        <Card
            shadow="sm"
            padding="md"
            onClick={() => navigate(`/${id}`)}
            className={styles.projectCard}
        >
            <Card.Section pos="relative">
                <Badge
                    title={`Edited ${elapsedTime === "now" ? elapsedTime : `${elapsedTime} ago`}`}
                    pos="absolute"
                    bottom={10}
                    right={10}
                    color={elapsedTime === "now" ? theme.primary : theme.dark}
                >
                    {elapsedTime === "now" ? elapsedTime : `${elapsedTime} ago`}
                </Badge>
                <Image
                    style={{ aspectRatio: 1.5 }}
                    src={content.background}
                    alt="Project"
                />
            </Card.Section>

            <Text title={title} fw={500} size="lg" mt="md">
                {title}
            </Text>

            <Text title={description} mt="xs" c="dimmed" size="sm">
                {description}
            </Text>
        </Card>
    )
};

export const ProjectGrid = ({ projects }: ProjectGridPropsType) => {
    return (
        <SimpleGrid cols={4}>
            {projects.map((project) => <GridItem key={project.id} {...project} />)}
        </SimpleGrid>
    )
};