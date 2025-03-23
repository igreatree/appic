import { AppShell, Button, Stack, Image, FileButton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AddImageIcon from "@assets/icons/image_add.svg";
import DrawIcon from "@assets/icons/draw.svg";
import ListIcon from "@assets/icons/list.svg";
import SettingsIcon from "@assets/icons/settings.svg";
import { useRef } from "react";
import { uploadImage } from "@shared/api/image";
import { compressImage } from "@shared/utils/compressImage";

type ToolbarPropsType = {
    projectId: string
}

export const Toolbar = ({ projectId }: ToolbarPropsType) => {
    const navagate = useNavigate();
    const resetRef = useRef<() => void>(null);

    const addImage = async (file: File | null) => {
        if (!file) return;
        const compressedImage = await compressImage(file);
        if (!compressedImage) return;
        const { data, status } = await uploadImage(compressedImage);
        console.log({ data, status });
        resetRef.current?.();
    }

    return (
        <AppShell.Navbar p="md">
            <Stack h={"100%"} justify="space-between">
                <Stack>
                    <FileButton resetRef={resetRef} onChange={addImage} accept="image/png,image/jpeg,image/svg">
                        {(props) => (
                            <Button
                                {...props}
                                justify="space-between"
                                rightSection={<span />}
                                leftSection={<Image src={AddImageIcon} />}
                                variant="outline"
                            >
                                Add Image
                            </Button>
                        )}
                    </FileButton>
                    <Button
                        justify="space-between"
                        rightSection={<span />}
                        leftSection={<Image src={DrawIcon} />}
                        variant="outline"
                        onClick={() => console.log("draw")}
                    >
                        Draw
                    </Button>
                </Stack>
                <Stack>
                    <Button
                        justify="space-between"
                        rightSection={<span />}
                        leftSection={<Image src={ListIcon} />}
                        variant="outline"
                        onClick={() => navagate(`/${projectId}/objects`)}
                    >
                        Objects
                    </Button>
                    <Button
                        justify="space-between"
                        rightSection={<span />}
                        leftSection={<Image src={SettingsIcon} />}
                        variant="outline"
                        onClick={() => navagate(`/${projectId}/settings`)}
                    >
                        Settings
                    </Button>
                </Stack>
            </Stack>
        </AppShell.Navbar>
    )
}