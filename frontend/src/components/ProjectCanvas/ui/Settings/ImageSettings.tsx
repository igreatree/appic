import { NodeConfig, Node } from "konva/lib/Node";
import { ActionIcon, Divider, Group, NumberInput, Slider, Stack, Title, Image } from "@mantine/core";
import AngleIcon from "@assets/icons/angle.svg";
import FlipHorizontalIcon from "@assets/icons/flipHorizontal.svg";
import FlipVerticalIcon from "@assets/icons/flipVertical.svg";
import RotateAnglelIcon from "@assets/icons/rotate-angle.svg";
import { useProjectStore } from "@shared/store";

type ImageSettingsPropsType = {
    selectedImage: Node<NodeConfig>
    disabled: boolean
};

export const ImageSettings = ({ selectedImage, disabled = false }: ImageSettingsPropsType) => {
    const { content, updateProjectImage } = useProjectStore();
    const image = content.images.find(i => i.id === selectedImage.attrs.id);
    if (!image) return null;
    return (
        <>
            <Stack p="sm" gap="xs">
                <Title size="sm">Position</Title>
                <Group wrap="nowrap" gap={4}>
                    <NumberInput
                        size="xs"
                        value={image.x}
                        onChange={(val) => updateProjectImage({
                            id: image.id,
                            x: +val,
                        })}
                        decimalScale={2}
                        leftSection="X"
                        title="Position X"
                        disabled={disabled}
                    />
                    <NumberInput
                        size="xs"
                        value={image.y}
                        onChange={(val) => updateProjectImage({
                            id: image.id,
                            y: +val,
                        })}
                        decimalScale={2}
                        leftSection="Y"
                        title="Position Y"
                        disabled={disabled}
                    />
                </Group>
                <Group wrap="nowrap" gap={12}>
                    <NumberInput
                        size="xs"
                        value={image.rotation}
                        onChange={(val) => updateProjectImage({
                            id: image.id,
                            rotation: Math.abs(+val) > 359 ? +val - (+val > 0 ? 360 : - 360) : +val,
                        })}
                        suffix="°"
                        decimalScale={2}
                        leftSection={<Image src={AngleIcon} />}
                        title="Angle"
                        disabled={disabled}
                    />
                    <ActionIcon
                        variant="white"
                        onClick={() => {
                            const newRotation = image.rotation + 90;
                            updateProjectImage({
                                id: image.id,
                                rotation: newRotation > 359 ? newRotation - 360 : image.rotation + 90,
                            });
                        }}
                        title="Rotate 90° right"
                        disabled={disabled}
                    >
                        <Image src={RotateAnglelIcon} />
                    </ActionIcon>
                    <ActionIcon
                        variant="white"
                        onClick={() => updateProjectImage({
                            id: image.id,
                            scale: {
                                x: -image.scale.x,
                                y: image.scale.y,
                            },
                        })}
                        title="Flip horizontal"
                        disabled={disabled}
                    >
                        <Image src={FlipHorizontalIcon} />
                    </ActionIcon>
                    <ActionIcon
                        variant="white"
                        onClick={() => updateProjectImage({
                            id: image.id,
                            scale: {
                                x: image.scale.x,
                                y: -image.scale.y,
                            },
                        })}
                        title="Flip vertival"
                        disabled={disabled}
                    >
                        <Image src={FlipVerticalIcon} />
                    </ActionIcon>
                </Group>
            </Stack>
            <Divider />
            <Stack p="sm" gap="xs">
                <Title size="sm">Size</Title>
                <Group wrap="nowrap" gap={4}>
                    <NumberInput
                        size="xs"
                        value={image.scale.x * image.width}
                        onChange={(val) => updateProjectImage({
                            id: image.id,
                            scale: {
                                x: Number(val) / image.width,
                                y: image.scale.y,
                            },
                        })}
                        decimalScale={2}
                        leftSection="W"
                        title="Width"
                        disabled={disabled}
                    />
                    <NumberInput
                        size="xs"
                        value={image.scale.y * image.height}
                        onChange={(val) => updateProjectImage({
                            id: image.id,
                            scale: {
                                x: image.scale.x,
                                y: Number(val) / image.height,
                            },
                        })}
                        decimalScale={2}
                        leftSection="H"
                        title="Height"
                        disabled={disabled}
                    />
                </Group>
            </Stack>
            <Divider />
            <Stack p="sm" gap="xs">
                <Title size="sm">Opacity</Title>
                <Slider
                    title="Opacity"
                    onChange={(val) => updateProjectImage({
                        id: image.id,
                        opacity: +val / 100
                    })}
                    value={Math.floor(image.opacity * 100)}
                />
            </Stack>
            <Divider />
        </>
    )
}