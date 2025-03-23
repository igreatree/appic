import { useCanvasSize } from "@shared/utils/useCanvasSize";
import { ProjectType } from "@shared/types/project";
import { Layer, Stage, Image } from "react-konva";
import { useImage } from "react-konva-utils";
import { ProjectImage } from "./ProjectImage";

type ProjectCanvasPropsType = {
    content: ProjectType["content"]
}

export const ProjectCanvas = ({ content }: ProjectCanvasPropsType) => {
    const [backgroundImage] = useImage(content.background);
    const { width, height } = useCanvasSize({ height: -60 });
    return (
        <Stage
            width={width}
            height={height}
            draggable
        >
            <Layer>
                <Image image={backgroundImage} />
                {content.images.map((image) => <ProjectImage key={image.id} {...image} />)}
            </Layer>
        </Stage>
    )
}