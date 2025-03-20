import { Stack, Title, Text, Paper } from "@mantine/core";
import { useRouteError } from "react-router-dom";
import styles from "./errorPage.module.scss";

export const ErrorPage = () => {
    const error = useRouteError() as { statusText: string | undefined, message: string, data?: string };
    console.error(error);

    return (
        <Paper p="md">
            <Stack className={styles.errorPage}>
                <Title>Error!</Title>
                <Text className={styles.error}>
                    {error.statusText || error.message || error.data}
                </Text>
            </Stack>
        </Paper>
    );
}
