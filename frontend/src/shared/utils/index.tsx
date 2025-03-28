import Konva from "konva";
import { NodeConfig, Node } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

export const getElapsedTime = (date: Date) => {
    const fromDate = new Date(date);
    const toDate = new Date();
    const months = Math.floor(toDate.getMonth() - fromDate.getMonth());
    const elapsedTime = (toDate.getTime() - fromDate.getTime()) / 1000;
    if (elapsedTime < 60) {
        return "now"; //`${Math.floor(elapsedTime)}s`
    } else if (elapsedTime < 3600) {
        return `${Math.floor(elapsedTime / 60)}m`;
    } else if (elapsedTime < 86400) {
        return `${Math.floor(elapsedTime / 60 / 60)}h`;
    } else if (elapsedTime < 604800) {
        const days = Math.floor(elapsedTime / 60 / 60 / 24);
        return `${days}${days > 1 ? "days" : "day"}`;
    } else if (months < 1) {
        const weeks = Math.floor(elapsedTime / 60 / 60 / 24 / 7);
        return `${weeks}${weeks > 1 ? "weeks" : "week"}`;
    } else if (months > 0 && months < 12) {
        return `${months}${months > 1 ? "months" : "month"}`;
    } else {
        const years = Math.floor(months / 12);
        return `${years}${years > 1 ? "years" : "year"}`;
    }
};

export const detectObjectOnPoint = (stage: Konva.Stage): Node<NodeConfig> | null => {
    const pos = stage.getPointerPosition() as Vector2d;
    const stageScale = stage.scaleX();
    const stageX = stage.x();
    const stageY = stage.y();
    const globalX = (pos.x - stageX) / stageScale;
    const globalY = (pos.y - stageY) / stageScale;
    const imageNodes = stage.find("Image").filter(i => i.attrs.id);
    for (let i = imageNodes.length - 1; i >= 0; i--) {
        const imageNode = imageNodes[i] as Konva.Image;
        const { width, height, visibility } = imageNode.attrs;
        if (!visibility) continue;
        const localPos = imageNode.getTransform().copy().invert().point({ x: globalX, y: globalY });
        const origX = localPos.x;
        const origY = localPos.y;

        if (origX < 0 || origX > width || origY < 0 || origY > height) continue;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.width = width;
        canvas.height = height;
        const image = imageNode.image() as HTMLImageElement;
        context.drawImage(image, 0, 0, width, height);
        const pixel = context.getImageData(origX, origY, 1, 1).data;

        if (pixel[3] !== 0) {
            return imageNode;
        }
    }
    return null;
};

export const rotatePoint = (
    point: Vector2d,
    pivot: Vector2d,
    angleDeg: number
): Vector2d => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const cosTheta = Math.cos(angleRad);
    const sinTheta = Math.sin(angleRad);

    const translatedX = point.x - pivot.x;
    const translatedY = point.y - pivot.y;

    const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
    const rotatedY = translatedX * sinTheta + translatedY * cosTheta;

    return {
        x: rotatedX + pivot.x,
        y: rotatedY + pivot.y,
    };
};

export const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(","),
        mimeMatch = arr[0].match(/:(.*?);/),
        mime = mimeMatch ? mimeMatch[1] : "",
        bstr = atob(arr[arr.length - 1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

export const getImageBoundingBox = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let minX = canvas.width, maxX = 0;
    let minY = canvas.height, maxY = 0;
    let found = false;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const alpha = pixels[index + 3];

            if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                found = true;
            }
        }
    }

    if (!found) return null;
    return {
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
    };
};

export const downloadURI = (uri: string, name: string) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

type BboxType = { x: number, y: number } & Partial<{ width: number, height: number }>;

const calcGlobalBBox = (stage: Konva.Stage) => {
    const imageNodes = stage.find("Image");
    const fn = imageNodes[0].getClientRect();
    let left: BboxType = fn
    let right: BboxType = fn
    let top: BboxType = fn
    let bottom: BboxType = fn
    imageNodes.forEach((d) => {
        const img = d as Konva.Image;
        const ibb = img.getClientRect();
        if (ibb.x < left.x) {
            left = ibb;
        }
        if (ibb.x + ibb.width > right.x) {
            right = { x: ibb.x + ibb.width, y: ibb.y + ibb.height };
        }
        if (ibb.y + ibb.height > bottom.y) {
            bottom = { x: ibb.x + ibb.width, y: ibb.y + ibb.height };
        }
        if (ibb.y < top.y) {
            top = ibb;
        }
    });
    return {
        x: left.x,
        y: top.y,
        xMax: right.x,
        yMax: bottom.y,
        width: right.x - left.x,
        height: bottom.y - top.y,
    };
};

type ZoomToFitPropsType = {
    stage: Konva.Stage
    size?: { width: number, height: number }
    padding?: number
    animate?: boolean
};

export const zoomToFit = ({ stage, padding = 10, size, animate = true }: ZoomToFitPropsType) => {
    const box = calcGlobalBBox(stage);
    const container = stage.container();
    const containerWidth = size ? size.width : container.clientWidth;
    const containerHeight = size ? size.height : container.clientHeight;
    const scaleX = (containerWidth - padding * 2) / box.width;
    const scaleY = (containerHeight - padding * 2) / box.height;
    const scale = Math.min(scaleX, scaleY);
    const x = -box.x * scale + (containerWidth - box.width * scale) / 2;
    const y = -box.y * scale + (containerHeight - box.height * scale) / 2;

    const newScale = stage.scaleX() * scale;
    if (animate) {
        stage.to({
            x: stage.x() * scale + x,
            y: stage.y() * scale + y,
            scaleX: newScale,
            scaleY: newScale,
        });
    } else {
        stage.scale({ x: scale, y: scale });
        stage.position({ x, y });
    }
};