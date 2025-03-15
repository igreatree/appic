import { AppShell, Button, Stack, Image, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AddImageIcon from "@assets/icons/image_add.svg";
import DrawIcon from "@assets/icons/draw.svg";
import ListIcon from "@assets/icons/list.svg";
import SettingsIcon from "@assets/icons/settings.svg";

type ToolbarPropsType = {
    projectId: string
}

export const Toolbar = ({ projectId }: ToolbarPropsType) => {
    const navagate = useNavigate();
    return (
        <AppShell.Navbar p="md">
            <Stack h={"100%"} justify="space-between">
                <Stack>
                    <Button
                        justify="space-between"
                        rightSection={<span />}
                        leftSection={<Image src={AddImageIcon} />}
                        variant="outline"
                        onClick={() => console.log("add image")}
                    >
                        Add Image
                    </Button>
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