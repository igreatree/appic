import { memo } from "react";
import Konva from "konva";
import { Stack, Title, Group, Text, ActionIcon, Image } from "@mantine/core";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { NodeConfig, Node } from "konva/lib/Node";
import { useProjectStore } from "@shared/store";
import { ImageType } from "@shared/types/project";
import HideIcon from "@assets/icons/hide.svg";
import ShowIcon from "@assets/icons/show.svg";
import ImageIcon from "@assets/icons/image.svg";
import MoreIcon from "@assets/icons/more.svg";
import { LayerMenu } from "./LayerMenu";
import cx from "clsx";
import styles from "./settings.module.scss";

type LayersPropsType = {
    stage: Konva.Stage
    selectedImage: Node<NodeConfig> | null
    setSelectedImage: (val: Node<NodeConfig> | null) => void
};

type ItemPropsType = {
    image: ImageType
    index: number
    selectImage: () => void
    active: boolean
};

type ListPropsType = {
    list: ImageType[]
    selectedImage: Node<NodeConfig> | null
    setSelectedImage: (val: Node<NodeConfig> | null) => void
    stage: Konva.Stage
};

const Item = ({ image, index, selectImage, active }: ItemPropsType) => {
    const { updateProjectImage } = useProjectStore();
    return (
        <Draggable draggableId={image.id} index={index}>
            {provided => (
                <Group
                    pl="sm"
                    pr="sm"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={selectImage}
                    className={active ? cx(styles.layer, styles.active) : styles.layer}
                    justify="space-between"
                    wrap="nowrap"
                    gap={0}
                >
                    <Group gap="xs" wrap="nowrap">
                        <Image opacity={0.2} w={20} src={ImageIcon} />
                        <Text title={image.name} className={styles.layerName}>{image.name}</Text>
                    </Group>
                    <Group gap="xs" wrap="nowrap">
                        <ActionIcon
                            className={image.visibility ? styles.eye : ""}
                            variant="transparent"
                            size="xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                updateProjectImage({
                                    id: image.id,
                                    visibility: !image.visibility
                                });
                            }}
                        >
                            <Image src={image.visibility ? ShowIcon : HideIcon} />
                        </ActionIcon>
                        <LayerMenu layer={image}>
                            <ActionIcon
                                className={styles.more}
                                variant="transparent"
                                size="xs"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image src={MoreIcon} />
                            </ActionIcon>
                        </LayerMenu>
                    </Group>
                </Group>
            )}
        </Draggable>
    );
};

const List = memo(({ list, selectedImage, setSelectedImage, stage }: ListPropsType) => {
    return list.map((image, index) => (
        <Item
            key={image.id}
            image={image}
            index={index}
            selectImage={() => {
                const node = stage.find("Image").find(i => i.attrs.id === image.id);
                node && setSelectedImage(node);
            }}
            active={image.id === selectedImage?.attrs.id}
        />
    ));
});

export const Layers = ({ stage, selectedImage, setSelectedImage }: LayersPropsType) => {
    const { updateProjectContent, content } = useProjectStore();
    const list = Array.from(content.images).reverse();

    const onDragEnd = (result: DropResult<string>) => {
        if (!result.destination || result.destination.index === result.source.index) return;

        const images = Array.from(content.images);
        const length = images.length - 1;
        const [removed] = images.splice(length - result.source.index, 1);
        images.splice(length - result.destination.index, 0, removed);

        updateProjectContent({ images });
    };

    return (
        <>
            <Title p="sm" size="sm">Layers</Title>
            <Stack pb="sm" gap="0" flex={1} style={{ overflowY: "auto" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list">
                        {provided => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <List stage={stage} setSelectedImage={setSelectedImage} selectedImage={selectedImage} list={list} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                {!list.length && <Text c="gray" p="sm">you don't have layers yet</Text>}
            </Stack>
        </>
    )
}