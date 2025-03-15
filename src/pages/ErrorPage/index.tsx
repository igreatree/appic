import { Stack, Title, Text } from "@mantine/core";
import { useRouteError } from "react-router-dom";
import styles from "./errorPage.module.scss";

export const ErrorPage = () => {
    const error = useRouteError() as { statusText: string | undefined, message: string };
    console.error(error);

    return (
        <Stack className={styles.errorPage}>
            <Title>Error!</Title>
            <Text className={styles.error}>
                {error.statusText || error.message}
            </Text>
        </Stack>
    );
}
