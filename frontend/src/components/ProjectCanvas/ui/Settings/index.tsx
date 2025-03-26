import Konva from "konva";
import { NodeConfig, Node } from "konva/lib/Node";
import { ActionIcon, CloseButton, Divider, Group, Image, Box, Title, Stack } from "@mantine/core";
import { useDisclosure, useFullscreen } from "@mantine/hooks";
import ChevronLeftIcon from "@assets/icons/chevron-left.svg";
import ZoomToFitIcon from "@assets/icons/zoomToFit.svg";
import FullScreenIcon from "@assets/icons/fullScreen.svg";
import DownloadIcon from "@assets/icons/download.svg";
import { downloadURI, zoomToFit } from "@shared/utils";
import { useProjectStore } from "@shared/store";
import { generateProjectImage } from "@shared/utils/image";
import { ImageSettings } from "./ImageSettings";
import { Layers } from "./Layers";
import cx from "clsx";
import styles from "./settings.module.scss";

type SettingsPropsType = {
    selectedImage: Node<NodeConfig> | null
    setSelectedImage: (val: Node<NodeConfig> | null) => void
    stage: Konva.Stage
};

export const Settings = ({ selectedImage, stage, setSelectedImage }: SettingsPropsType) => {
    const [opened, { toggle, close }] = useDisclosure(true);
    const { toggle: toggleFullScreen, fullscreen } = useFullscreen();
    const { title, content } = useProjectStore();
    const processedTitle = selectedImage?.attrs ? selectedImage?.attrs.name || "Object" : "";

    return (
        <Box
            onKeyDown={(e) => e.stopPropagation()}
            className={opened ? styles.settings : cx(styles.settings, styles.collapsed)}
        >
            <Group
                p="sm"
                justify="space-between"
                wrap="nowrap"
                gap={0}
            >
                <Title title={processedTitle} className={styles.title} size="md">{processedTitle}</Title>
                <CloseButton onClick={close} />
            </Group>
            <Divider />
            <Stack gap={0} className={styles.wrapper}>
                <ActionIcon
                    onClick={toggle}
                    className={styles.openButton}
                    variant="white"
                >
                    <Image src={ChevronLeftIcon} />
                </ActionIcon>
                {selectedImage && <ImageSettings selectedImage={selectedImage} />}
                <Layers selectedImage={selectedImage} stage={stage} setSelectedImage={setSelectedImage} />
                <Divider label={"Tools"} />
                <Group p="sm" pt={0}>
                    <ActionIcon
                        size="sm"
                        title="Zoom to fit"
                        variant="white"
                        onClick={() => zoomToFit({ stage })}
                    >
                        <Image src={ZoomToFitIcon} />
                    </ActionIcon>
                    <ActionIcon
                        size="sm"
                        title={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        variant="white"
                        onClick={toggleFullScreen}
                    >
                        <Image src={FullScreenIcon} />
                    </ActionIcon>
                    <ActionIcon
                        size="sm"
                        title={`${title}.png (FullHD)`}
                        variant="white"
                        onClick={async () => {
                            const img = await generateProjectImage(content, { width: 1920, height: 1080 });
                            downloadURI(img, title);
                        }}
                    >
                        <Image src={DownloadIcon} />
                    </ActionIcon>
                </Group>
            </Stack>
        </Box>
    )
}