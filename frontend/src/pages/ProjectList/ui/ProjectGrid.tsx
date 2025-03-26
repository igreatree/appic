import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Box, Card, Center, Image, Loader, SimpleGrid, Text } from "@mantine/core";
import { ProjectType } from "@shared/types/project";
import { getElapsedTime } from "@shared/utils";
import { generateProjectImage } from "@shared/utils/image";
import { useIsMobile } from "@shared/utils/hooks/useIsMobile";
import theme from "@/theme.module.scss";
import styles from "./projectGrid.module.scss";

type ProjectGridPropsType = {
    projects: ProjectType[]
}

const GridItem = ({ id, title, description, content, lastUpdate }: ProjectType) => {
    const navigate = useNavigate();
    const elapsedTime = getElapsedTime(lastUpdate);
    const [previewImage, setPreviewImage] = useState<string>();

    useEffect(() => {
        const generatePreview = async () => {
            const preview = await generateProjectImage(content);
            setPreviewImage(preview);
        }
        generatePreview();
    }, []);

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
                {previewImage && <Image
                    style={{ aspectRatio: 1.5, backgroundColor: "#e2e2e2" }}
                    src={previewImage}
                    alt="Project"
                />}
                {!previewImage && (
                    <Box style={{ aspectRatio: 1.5 }}>
                        <Center h={"100%"}>
                            <Loader />
                        </Center>
                    </Box>
                )}
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
    const isMobile = useIsMobile();
    return (
        <SimpleGrid cols={isMobile ? 1 : 4}>
            {projects.map((project) => <GridItem key={project.id} {...project} />)}
        </SimpleGrid>
    )
};