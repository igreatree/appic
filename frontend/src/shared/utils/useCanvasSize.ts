import { useEffect, useState } from "react";
import { Size } from "@shared/types";

export const useCanvasSize = ({ width = 0, height = 0 }: Partial<Size>): Size => {
    const [canvasSize, setCanvasSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return { width: canvasSize.width + width, height: canvasSize.height + height };
};
