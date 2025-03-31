import { Image } from "react-konva";
import { useImage } from "react-konva-utils";
import { NodeConfig, Node } from "konva/lib/Node";
import { useProjectStore } from "@shared/store";
import { ImageType } from "@shared/types/project";
import { CropStatus, PerspectiveStatus } from "@shared/types";

type ProjectImagePropsType = {
    data: ImageType
    selectedImage: Node<NodeConfig> | null
    cropStatus: CropStatus | null
    perspectiveStatus: PerspectiveStatus | null
};

export const ProjectImage = ({ data, selectedImage, cropStatus, perspectiveStatus }: ProjectImagePropsType) => {
    const [image] = useImage(data.src, "anonymous");
    const { updateProjectImage } = useProjectStore();
    const visible = selectedImage?.attrs.id === data.id ? !!!(cropStatus || perspectiveStatus) : data.visibility;
    return (
        <Image
            {...data}
            image={image}
            visible={visible}
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