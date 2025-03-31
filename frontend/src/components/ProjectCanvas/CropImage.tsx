import { useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { KonvaEventObject, NodeConfig, Node } from "konva/lib/Node";
import { Circle, Group, Line, Image } from "react-konva";
import { uploadImage } from "@shared/api/image";
import { ImageType } from "@shared/types/project";
import { useProjectStore } from "@shared/store";
import { CropStatus } from "@shared/types";
import { dataURLtoFile, getImageBBox, rotatePoint } from "@shared/utils";
import theme from "@/theme.module.scss";

const compositeOperationRule: { [key: string]: GlobalCompositeOperation } = {
    in: "destination-out",
    out: "destination-in",
};

interface CropImageProps {
    stage: Konva.Stage
    selectedImage: Node<NodeConfig> | null
    cropStatus: CropStatus
    setCropStatus: (val: CropStatus | null) => void
};

export const CropImage = ({ stage, selectedImage, cropStatus, setCropStatus }: CropImageProps) => {
    const { content, updateProjectImage } = useProjectStore();
    const image = content.images.find((image) => image.id === selectedImage?.attrs.id) as ImageType;
    const [cropData, setCropData] = useState<Vector2d[]>([]);
    const [scale, setScale] = useState(stage.scaleX());
    const isShapeFinished = cropStatus !== "started";
    const compositeOperation = useRef<string>(null);

    const canvas = useMemo(() => {
        if (selectedImage && cropStatus) {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.drawImage(selectedImage.attrs.image, 0, 0, image.width, image.height)
            if (cropStatus in compositeOperationRule || cropStatus === "accepted") {
                if (cropStatus === "accepted" && compositeOperation.current) {
                    ctx.globalCompositeOperation = compositeOperationRule[compositeOperation.current];
                } else {
                    ctx.globalCompositeOperation = compositeOperationRule[cropStatus];
                    compositeOperation.current = cropStatus;
                }
                ctx.beginPath();
                const rotatedPonts = cropData.map((point) => rotatePoint(point, { x: image.x, y: image.y }, -image.rotation));
                rotatedPonts.forEach(({ x, y }, index) => {
                    index === 0 ?
                        ctx.moveTo(x / image.scale.x - image.x / image.scale.x, y / image.scale.y - image.y / image.scale.y)
                        :
                        ctx.lineTo(x / image.scale.x - image.x / image.scale.x, y / image.scale.y - image.y / image.scale.y);
                });
                ctx.closePath();
                ctx.fill();
                ctx.globalCompositeOperation = "source-over";
            }

            return canvas;
        }
    }, [selectedImage, cropStatus, cropData, image]);

    const acceptImage = async () => {
        if (canvas) {
            const boundingBox = getImageBBox(canvas);
            if (!boundingBox) return;
            const { width, height, x, y } = boundingBox;
            const croppedCanvas = document.createElement("canvas");
            const croppedCtx = croppedCanvas.getContext("2d") as CanvasRenderingContext2D;
            croppedCanvas.width = width;
            croppedCanvas.height = height;
            croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

            const croppedImg = croppedCanvas.toDataURL();
            const fileImage = dataURLtoFile(croppedImg, `${image.name}_cropped.png`);
            const { data: { url }, status } = await uploadImage(fileImage);
            if (status === 200) {
                const rotatedPont = rotatePoint({ x: image.x + x * image.scale.x, y: image.y + y * image.scale.y }, image, image.rotation);
                updateProjectImage({ id: image.id, src: url, width, height, x: rotatedPont.x, y: rotatedPont.y, rotation: image.rotation });
                setCropStatus(null);
            }
        }
    };

    useEffect(() => {
        const onClick = (e: KonvaEventObject<MouseEvent, Konva.Stage>) => {
            if (e.target.attrs.data === "point") return;
            const pointer = stage.getPointerPosition() as Vector2d;
            const transform = stage.getAbsoluteTransform().copy().invert();
            const pos = transform.point(pointer);
            setCropData((prev) => ([...prev, pos]));
        };
        if (!isShapeFinished) {
            stage.on("click", onClick);
            return () => {
                stage.off("click", onClick);
            }
        }
        if (cropStatus === "accepted") acceptImage();
    }, [cropStatus]);

    useEffect(() => {
        const onMouseWheel = () => setScale(stage.scaleX());
        stage.on("scaleXChange", onMouseWheel);
        return () => {
            stage.off("scaleXChange", onMouseWheel);
        }
    }, []);

    return (
        <Group>
            <Image {...image} image={canvas} />
            {
                cropData.length > 0 && (
                    <Line
                        points={cropData.flatMap((point) => (Object.values(point)))}
                        stroke={isShapeFinished ? "white" : theme.primary}
                        strokeWidth={2 / scale}
                        dash={[4 / scale, 4 / scale]}
                        closed={isShapeFinished}
                    />
                )
            }
            {
                cropData.map((point, index) => (
                    <Circle
                        {...point}
                        key={index}
                        draggable
                        data="point"
                        fill={isShapeFinished ? theme.primary : "white"}
                        stroke={isShapeFinished ? "white" : theme.primary}
                        strokeWidth={3 / scale}
                        radius={5 / scale}
                        onClick={() => {
                            if (isShapeFinished) return;
                            if (index === 0 && cropData.length > 2) {
                                setCropStatus("in");
                            } else if (cropData.length > 2) {
                                setCropData((prev) => ([...prev, point]));
                            }
                        }}
                        onDragMove={(e) => setCropData((prev) => prev.map((p, i) => index === i ? e.target.position() : p))}
                    />
                ))
            }
        </Group >
    );
}