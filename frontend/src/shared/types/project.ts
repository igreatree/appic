import { Vector2d } from "konva/lib/types";

export type ImageType = {
    id: string
    src: string
    x: number
    y: number
    width: number
    height: number
    rotation: number
    opacity: number
    visibility: boolean
    scale: Vector2d
    // additional
    name?: string
    url?: string
    description?: string
}

export type ProjectType = {
    id: number
    title: string
    description: string
    lastUpdate: Date
    content: {
        background: string
        images: ImageType[]
    }
}