import { useRef, useState } from "react";
import { AppShell, Button, Stack, Image, FileButton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AddImageIcon from "@assets/icons/image_add.svg";
import DrawIcon from "@assets/icons/draw.svg";
import ListIcon from "@assets/icons/list.svg";
import SettingsIcon from "@assets/icons/settings.svg";
import SaveIcon from "@assets/icons/save.svg";
import { uploadImage } from "@shared/api/image";
import { updateProject } from "@shared/api/project";
import { compressImage } from "@shared/utils/image";
import { useProjectStore } from "@shared/store";
import { getProjectState } from "@shared/store/utils";
import { NotFoundRequestType } from "@shared/types";

type ToolbarPropsType = {
    projectId: string
}

export const Toolbar = ({ projectId }: ToolbarPropsType) => {
    const navagate = useNavigate();
    const resetRef = useRef<() => void>(null);
    const [isImageAdding, setIsImageAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addProjectImage } = useProjectStore();

    const addImage = async (file: File | null) => {
        if (!file) return;
        const compressedImage = await compressImage(file) || file;
        setIsImageAdding(true);
        const { data: { url, width, height }, status } = await uploadImage(compressedImage);
        if (status === 200) {
            const id = crypto.randomUUID();
            addProjectImage({
                id,
                src: url,
                width,
                height,
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1,
                visibility: true,
                scale: { x: 1, y: 1 }
            });
        }
        resetRef.current?.();
        setIsImageAdding(false);
    };

    const saveProject = async () => {
        setIsSaving(true);
        const project = getProjectState();
        const { status, data } = await updateProject(project);
        if (status === 200) {
            console.log(`%cSuccessfuly saved!`, "color:green; font-size:12px;");

        } else {
            const message = (data as NotFoundRequestType).message;
            console.error(message);
        }
        setIsSaving(false);
    };

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
                                loading={isImageAdding}
                                leftSection={<Image src={AddImageIcon} />}
                                variant="outline"
                                disabled={isImageAdding}
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
                    <Button
                        justify="space-between"
                        rightSection={<span />}
                        loading={isSaving}
                        leftSection={<Image src={SaveIcon} />}
                        disabled={isSaving}
                        onClick={saveProject}
                    >
                        Save
                    </Button>
                </Stack>
            </Stack>
        </AppShell.Navbar>
    )
}