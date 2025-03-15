import { Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "./toolbar.module.scss";

export const Toolbar = () => {
    return (
        <Stack className={styles.toolbar} p="md">
            <Link to="settings">Settings</Link>
        </Stack>
    )
}