import { Image } from "react-konva";
import { useImage } from "react-konva-utils";
import { useProjectStore } from "@shared/store";
import { ImageType } from "@shared/types/project";

export const ProjectImage = (data: ImageType) => {
    const [image] = useImage(data.src, "anonymous");
    const { updateProjectImage } = useProjectStore();
    return (
        <Image
            {...data}
            image={image}
            visible={data.visibility}
            onTransformEnd={(e) => {
                updateProjectImage({
                    id: data.id,
                    ...e.target.position(),
                    scale: e.target.scale(),
                    rotation: e.target.rotation()
                })
            }}
        />
    )
}