import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Layer, Stage, Image, Transformer } from "react-konva";
import { useImage } from "react-konva-utils";
import { NodeConfig, Node } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useCanvasSize } from "@shared/utils/useCanvasSize";
import { ProjectType } from "@shared/types/project";
import { detectObjectOnPoint, zoomToFit } from "@shared/utils";
import { useProjectStore } from "@shared/store";
import { ProjectImage } from "./ProjectImage";
import theme from "@/theme.module.scss";

type ProjectCanvasPropsType = {
    content: ProjectType["content"]
}

export const ProjectCanvas = ({ content }: ProjectCanvasPropsType) => {
    const [backgroundImage, status] = useImage(content.background, "anonymous");
    const { width, height } = useCanvasSize({ height: -60 });
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const startPos = useRef<{ point: Vector2d, target: Vector2d }>(null);
    const isMouseDown = useRef(false);
    const [selectedImage, setSelectedImage] = useState<Node<NodeConfig> | null>(null);
    const { updateProjectImage } = useProjectStore();

    const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target.getParent() instanceof Konva.Transformer) return;
        const stage = e.target.getStage();
        if (!stage) return;

        const detected = detectObjectOnPoint(stage);
        startPos.current = { point: { x: e.evt.clientX, y: e.evt.clientY }, target: detected ? detected.position() : stage.position() };
        isMouseDown.current = true;
        setSelectedImage(detected);
    };

    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (!stage) return;

        const scale = stage.scaleX();
        if (startPos.current && isMouseDown.current) {
            const pos = startPos.current.target;
            const x = e.evt.clientX - startPos.current.point.x;
            const y = e.evt.clientY - startPos.current.point.y;
            if (selectedImage) {
                selectedImage.position({ x: pos.x + x / scale, y: pos.y + y / scale });
            } else {
                stage.position({ x: pos.x + x, y: pos.y + y });
            }
        }
    };

    const onMouseUp = () => {
        if (selectedImage) updateProjectImage({ id: selectedImage.attrs.id, ...selectedImage.position() });
        isMouseDown.current = false;
        startPos.current = null;
    };

    const onMouseWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        if (!stage) return;

        const scale = stage.scaleX();
        const pointer = stage.getPointerPosition() as Vector2d;
        const zoomSpeed = 1.02;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / scale,
            y: (pointer.y - stage.y()) / scale,
        };

        let direction = e.evt.deltaY > 0 ? -1 : 1;

        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const newScale = direction > 0 ? scale * zoomSpeed : scale / zoomSpeed;

        stage.scale({ x: newScale, y: newScale });
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
    };

    useEffect(() => {
        if (selectedImage) {
            transformerRef.current?.nodes([selectedImage]);
        }
    }, [selectedImage]);

    useEffect(() => {
        if (stageRef.current && status === "loaded") {
            zoomToFit({ stage: stageRef.current });
        }
    }, [stageRef, status]);

    return (
        <Stage
            ref={stageRef}
            width={width}
            height={height}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onMouseWheel}
        >
            <Layer>
                <Image image={backgroundImage} />
                {content.images.map((image) => <ProjectImage key={image.id} {...image} />)}
                {selectedImage && <Transformer anchorStroke={theme.primary} borderStroke={theme.primary} ref={transformerRef} />}
            </Layer>
        </Stage>
    )
}