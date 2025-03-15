import { AppShell } from "@mantine/core";
import { Link } from "react-router-dom";

type ToolbarPropsType = {
    projectId: string
}

export const Toolbar = ({ projectId }: ToolbarPropsType) => {
    return (
        <AppShell.Navbar p="md">
            <Link to={`/${projectId}/objects`}>Objects</Link>
            <Link to={`/${projectId}/settings`}>Settings</Link>
        </AppShell.Navbar>
    )
}