import { useCanvasSize } from "@shared/utils/useCanvasSize";
import { ProjectType } from "@shared/types/project";
import { Layer, Stage, Image } from "react-konva";
import { useImage } from "react-konva-utils";
import { ProjectImage } from "./ProjectImage";

export const ProjectCanvas = (project: ProjectType) => {
    const [backgroundImage] = useImage(project.content.background);
    const { width, height } = useCanvasSize({ height: -60 });
    return (
        <Stage
            width={width}
            height={height}
            draggable
        >
            <Layer>
                <Image image={backgroundImage} />
                {project.content.images.map(image => <ProjectImage {...image} />)}
            </Layer>
        </Stage>
    )
}