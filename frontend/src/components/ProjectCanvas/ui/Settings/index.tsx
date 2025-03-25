import Konva from "konva";
import { NodeConfig, Node } from "konva/lib/Node";
import { ActionIcon, CloseButton, Divider, Group, Image, Box, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ChevronLeftIcon from "@assets/icons/chevron-left.svg";
import { ImageSettings } from "./ImageSettings";
import cx from "clsx";
import styles from "./settings.module.scss";

type SettingsPropsType = {
    selectedImage: Node<NodeConfig> | null
    setSelectedImage: (val: Node<NodeConfig> | null) => void
    stage: Konva.Stage | null
};

export const Settings = ({ selectedImage }: SettingsPropsType) => {
    const [opened, { toggle, close }] = useDisclosure();

    return (
        <Box
            onKeyDown={(e) => e.stopPropagation()}
            className={opened ? styles.settings : cx(styles.settings, styles.collapsed)}
        >
            <Group p="sm" justify="space-between">
                <Title size="md">{selectedImage?.attrs ? selectedImage?.attrs.name || "Object" : ""}</Title>
                <CloseButton onClick={close} />
            </Group>
            <Divider />
            <ActionIcon
                onClick={toggle}
                className={styles.openButton}
                variant="white"
            >
                <Image src={ChevronLeftIcon} />
            </ActionIcon>
            {selectedImage && <ImageSettings selectedImage={selectedImage} />}
        </Box>
    )
}