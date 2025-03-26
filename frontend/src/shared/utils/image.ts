import Konva from "konva";
import { ProjectType } from "@shared/types/project";
import { zoomToFit } from "@shared/utils";

export const compressImage = (file: File, quality = 0.7, maxWidth?: number): Promise<File | null> => {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.src = url;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) return;
            if (maxWidth) {
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            const hasTransparency = checkTransparency(imageData);
            if (hasTransparency) {
                console.log(`%cNot compressed: image has trasparency (${(file.size / (1024 * 1024)).toFixed(2)}mb)`, "color:red; font-size:12px;");
                resolve(file);
                return;
            }
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const res = new File([blob], `${file.name}_compressed`, { type: "image/jpeg" });
                        console.log(`%cCompressed: ${((file.size - res.size) / (1024 * 1024)).toFixed(2)}mb (${(file.size / (1024 * 1024)).toFixed(2)} -> ${(res.size / (1024 * 1024)).toFixed(2)})`, "color:magenta; font-size:12px;");
                        resolve(res);
                    } else {
                        console.log(`%cNot compressed: image blob error (${(file.size / (1024 * 1024)).toFixed(2)}mb)`, "color:red; font-size:12px;");
                        resolve(null);
                    }
                },
                "image/jpeg",
                quality
            );
        };
    });
};

const checkTransparency = (data: ImageData["data"]) => {
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) {
            return true;
        }
    }
    return false;
};

export const asyncHTMLImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        // img.onerror = () => img.src = ErrorImage;
        img.src = src;
    });
};

const defaultSize = { width: 720, height: 480 };

export const generateProjectImage = async (content: ProjectType["content"], size = defaultSize): Promise<string> => {
    const bgImage = await asyncHTMLImage(content.background);
    const stage = new Konva.Stage({
        ...size,
        container: document.createElement("div"),
    });
    const layer = new Konva.Layer();
    stage.add(layer);
    layer.add(new Konva.Image({ image: bgImage }));
    const images = await Promise.all(content.images.map((i) => asyncHTMLImage(i.src)))
    images.forEach((image, i) => layer.add(new Konva.Image({ image, ...content.images[i] })));
    zoomToFit({ stage, padding: 0, size: size, animate: false });
    return stage.toDataURL();
};