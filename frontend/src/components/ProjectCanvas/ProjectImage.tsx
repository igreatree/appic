import { ImageType } from "@shared/types/project";
import { Image } from "react-konva";
import { useImage } from "react-konva-utils";

export const ProjectImage = (data: ImageType) => {
    const [image] = useImage(data.src);

    return (
        <Image
            {...data}
            image={image}
            draggable
        />
    )
}