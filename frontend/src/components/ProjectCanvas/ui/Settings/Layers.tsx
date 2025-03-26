import { memo } from "react";
import Konva from "konva";
import { Stack, Title, Divider, Group, Text, ActionIcon, Image } from "@mantine/core";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { NodeConfig, Node } from "konva/lib/Node";
import { useProjectStore } from "@shared/store";
import { ImageType } from "@shared/types/project";
import HideIcon from "@assets/icons/hide.svg";
import ShowIcon from "@assets/icons/show.svg";
import ImageIcon from "@assets/icons/image.svg";
import styles from "./settings.module.scss";

type LayersPropsType = {
    stage: Konva.Stage
    setSelectedImage: (val: Node<NodeConfig> | null) => void
};

type ItemPropsType = {
    image: ImageType
    index: number
    selectImage: () => void
};

type ListPropsType = {
    list: { image: ImageType, node: Node<NodeConfig> }[]
    setSelectedImage: (val: Node<NodeConfig> | null) => void
};

const Item = ({ image, index, selectImage }: ItemPropsType) => {
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
                    className={styles.layer}
                    justify="space-between"
                >
                    <Group gap="xs">
                        <Image opacity={0.2} w={20} src={ImageIcon} />
                        <Text>{image.name}</Text>
                    </Group>
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
                </Group>
            )}
        </Draggable>
    );
};

const List = memo(({ list, setSelectedImage }: ListPropsType) => {
    return list.map(({ image, node }, index) => (
        <Item
            key={image.id}
            image={image}
            index={index}
            selectImage={() => setSelectedImage(node)}
        />
    ));
});

export const Layers = ({ stage, setSelectedImage }: LayersPropsType) => {
    const { updateProjectContent, content } = useProjectStore();
    const nodes = stage.find("Image");
    const list = content.images.map(i => ({ image: i, node: nodes.find(n => n.attrs.id === i.id) as Node<NodeConfig> })).reverse();

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
            <Stack pb="sm" gap="0">
                <Title p="sm" size="sm">Layers</Title>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list">
                        {provided => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <List setSelectedImage={setSelectedImage} list={list} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Stack>
            <Divider />
        </>
    )
}