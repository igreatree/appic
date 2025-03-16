import { Paper, Image, Stack, ActionIcon } from "@mantine/core";
import { Link } from "react-router-dom";
import PlusIcon from "@assets/icons/plus-light.svg";

export const ProjectList = () => {
    return (
        <Paper p="md">
            <Stack>
                <ActionIcon><Image src={PlusIcon} /></ActionIcon>
                <Link to="/project">Project (test)</Link>
            </Stack>
        </Paper>
    )
}