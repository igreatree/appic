import Konva from "konva";
import { NodeConfig, Node } from "konva/lib/Node";
import { Animation } from "konva/lib/Animation";
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

    if (animate) {
        const { x: oldX, y: oldY } = stage.position();
        const oldScale = stage.scaleX();
        const animation = new Animation((frame) => {
            const time = frame?.time || 0;
            const c = time / 300 > 1 ? 1 : time / 300;

            const newX = oldX + (x - oldX) * c;
            const newY = oldY + (y - oldY) * c;
            const newScale = oldScale - (oldScale - scale) * c;
            stage.position({ x: newX, y: newY });
            stage.scale({ x: newScale, y: newScale });

            if (c === 1) animation.stop();
        });
        animation.start();
    } else {
        stage.scale({ x: scale, y: scale });
        stage.position({ x, y });
    }
};