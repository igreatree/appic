import { Stack, Alert } from "@mantine/core";
import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
    const error = useRouteError() as { statusText: string | undefined, message: string, data?: string };
    console.error(error);

    return (
        <Stack p="md">
            <Alert variant="light" color="red" title="Error">{error.statusText || error.message || error.data}</Alert>
        </Stack>
    );
}
