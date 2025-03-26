import { Stack } from "@mantine/core";
import { useProjectStore } from "@shared/store";

export const Objects = () => {
    const { content } = useProjectStore();
    return (
        <Stack p="md">
            {content.images.map((i, index) => `${index}) ${i.name}\n`)}
        </Stack>
    )
}