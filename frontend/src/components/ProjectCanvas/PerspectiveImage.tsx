import { useEffect, useMemo, useState } from "react";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { NodeConfig, Node } from "konva/lib/Node";
import { Circle, Group, Line, Image } from "react-konva";
import { uploadImage } from "@shared/api/image";
import { ImageType } from "@shared/types/project";
import { useProjectStore } from "@shared/store";
import { PerspectiveStatus } from "@shared/types";
import { calcBBox, changeImageSize, dataURLtoFile, getDefaultAnglePos, rotatePoint } from "@shared/utils";
import * as fx from "glfx-es6";

type PerspectiveImageProps = {
    stage: Konva.Stage
    selectedImage: Node<NodeConfig>
    perspectiveStatus: PerspectiveStatus
    setPerspectiveStatus: (val: PerspectiveStatus | null) => void
};

export const PerspectiveImage = ({ stage, selectedImage, perspectiveStatus, setPerspectiveStatus }: PerspectiveImageProps) => {
    const { content, updateProjectImage } = useProjectStore();
    const image = content.images.find((image) => image.id === selectedImage.attrs.id) as ImageType;
    const canvas = useMemo(() => fx.canvas(), [selectedImage]);
    const texture = useMemo(() => canvas.texture(selectedImage.attrs.image), [selectedImage]);
    const [points, setPoints] = useState<Vector2d[]>(getDefaultAnglePos(image).map((p) => rotatePoint(p as Vector2d, image, image.rotation)));
    const [scale, setScale] = useState(stage.scaleX());
    const bbox = useMemo(() => calcBBox(points), [points]);
    const canvasProps = {
        ...image,
        ...bbox,
        width: bbox.width / image.scale.x,
        height: bbox.height / image.scale.y,
        rotation: 0,
    };

    const acceptImage = async () => {
        const newImg = await changeImageSize({ ...bbox, image: selectedImage.attrs.image });
        const canvas = fx.canvas();
        const newTexture = canvas.texture(newImg);
        const anglePoints = points.map(p => [
            (p.x - bbox.x) * (bbox.width / image.scale.x) / canvasProps.width,
            (p.y - bbox.y) * (bbox.height / image.scale.y) / canvasProps.height
        ]).flatMap(p => p);
        canvas.draw(newTexture);
        canvas.perspective(getDefaultAnglePos(bbox as ImageType, true), anglePoints).update();
        const perspectiveImg = canvas.toDataURL();
        const fileImage = dataURLtoFile(perspectiveImg, `${image.name}_perspective.png`);
        const { data: { url }, status } = await uploadImage(fileImage);
        if (status === 200) {
            updateProjectImage({
                id: image.id,
                src: url,
                scale: { x: 1, y: 1 },
                rotation: 0,
                ...bbox
            });
            setPerspectiveStatus(null);
        }
    };

    useEffect(() => {
        setPoints(getDefaultAnglePos(image).map((p) => rotatePoint(p as Vector2d, image, image.rotation)));
    }, [selectedImage]);

    useEffect(() => {
        const anglePoints = points.map(p => [
            (p.x - bbox.x) * image.width / bbox.width * (image.scale.x > 0 ? 1 : -1),
            (p.y - bbox.y) * image.height / bbox.height * (image.scale.y > 0 ? 1 : -1)
        ]);
        const xMin = Math.min(...anglePoints.map(([x]) => (x)));
        const yMin = Math.min(...anglePoints.map(([_, y]) => (y)));
        const processedPoints = anglePoints.map(([x, y]) => ([x - xMin, y - yMin])).flat();
        canvas.draw(texture);
        canvas.perspective(getDefaultAnglePos(image, true), processedPoints).update();
    }, [points])

    useEffect(() => {
        if (perspectiveStatus === "accepted") acceptImage();
    }, [perspectiveStatus]);

    useEffect(() => {
        const onMouseWheel = () => setScale(stage.scaleX());
        stage.on("scaleXChange", onMouseWheel);
        return () => {
            stage.off("scaleXChange", onMouseWheel);
        }
    }, []);

    return (
        <Group>
            <Image
                {...canvasProps}
                image={canvas}
            />
            {
                points.length > 0 && (
                    <Line
                        points={points.flatMap((point) => (Object.values(point)))}
                        stroke="red"
                        strokeWidth={2 / scale}
                        dash={[4 / scale, 4 / scale]}
                        closed
                    />
                )
            }
            {
                points.map((point, index) => (
                    <Circle
                        {...point}
                        key={index}
                        draggable
                        data="point"
                        fill="white"
                        stroke="red"
                        strokeWidth={3 / scale}
                        radius={5 / scale}
                        onDragMove={(e) => setPoints((prev) => prev.map((p, i) => index === i ? e.target.position() : p))}
                        onMouseOver={() => stage.container().style.cursor = "move"}
                        onMouseLeave={() => stage.container().style.cursor = "default"}
                    />
                ))
            }
        </Group >
    );
}