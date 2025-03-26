import { ReactNode } from "react";
import { Menu, Image } from "@mantine/core";
import DeleteDangerIcon from "@assets/icons/delete-danger.svg";
import SettingsIcon from "@assets/icons/settings.svg";
import CopyIcon from "@assets/icons/copy.svg";
import { ImageType } from "@shared/types/project";
import { useProjectStore } from "@shared/store";
import theme from "@/theme.module.scss";

type LayerMenuPropsType = {
    children: ReactNode
    layer: ImageType
};

export const LayerMenu = ({ children, layer }: LayerMenuPropsType) => {
    const { addProjectImage, deleteProjectImage } = useProjectStore();

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                {children}
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Options</Menu.Label>
                <Menu.Item disabled leftSection={<Image src={SettingsIcon} w={14} />}>
                    Properties
                </Menu.Item>
                <Menu.Item
                    leftSection={<Image src={CopyIcon} w={14} />}
                    onClick={(e) => {
                        e.stopPropagation();
                        const id = crypto.randomUUID();
                        addProjectImage({
                            ...layer,
                            id,
                            x: layer.x + 10,
                            y: layer.y + 10,
                            name: layer.name + "(copy)",
                        });
                    }}
                >
                    Copy
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    color={theme.danger}
                    leftSection={<Image src={DeleteDangerIcon} w={14} />}
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteProjectImage(layer.id);
                    }}
                >
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu >
    );
}