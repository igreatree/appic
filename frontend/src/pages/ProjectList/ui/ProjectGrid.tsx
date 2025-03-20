import { ProjectType } from "@shared/types/project"
import { Card, Image, SimpleGrid, Text } from "@mantine/core"
import { useNavigate } from "react-router-dom";
import styles from "./projectGrid.module.scss";

type ProjectGridPropsType = {
    projects: ProjectType[]
}

const GridItem = ({ id, title, description, content }: ProjectType) => {
    const navigate = useNavigate();

    return (
        <Card
            shadow="sm"
            padding="md"
            onClick={() => navigate(`/${id}`)}
            className={styles.projectCard}
        >
            <Card.Section>
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