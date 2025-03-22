import { createProject } from "@shared/api/project";
import { ProjectType } from "@shared/types/project";
import { BadRequestType } from "@shared/types";
import { Button, Group, Loader, Modal, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

type ModalProjectCreatePropsType = {
    opened: boolean
    close: () => void
    onSuccess?: (val: ProjectType) => void
    onError?: (val: string) => void
}

export const ModalProjectCreate = ({ opened, close, onSuccess, onError }: ModalProjectCreatePropsType) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: "",
            description: "",
            content: {
                background: "/images/empty-room.jpg",
                images: []
            },
        },
    });

    const submitHandler = async (props: Omit<ProjectType, "id" | "lastUpdate">) => {
        setIsLoading(true);
        const { status, data } = await createProject(props);
        if (status === 201) {
            onSuccess && onSuccess(data as ProjectType)
        } else {
            const message = (data as BadRequestType).message;
            console.error(message);
            onError && onError(message);
        }
        setIsLoading(false);
        close();
    };

    return (
        <Modal centered opened={opened} onClose={close} title="Create project">
            <form onSubmit={form.onSubmit(submitHandler)}>
                <TextInput
                    required
                    withAsterisk
                    label="Name"
                    placeholder="Super project"
                    key={form.key("title")}
                    {...form.getInputProps("title")}
                />
                <Textarea
                    resize="vertical"
                    label="Description"
                    placeholder="Project description"
                    key={form.key("description")}
                    {...form.getInputProps("description")}
                />
                <Group justify="space-between" mt="md">
                    <Button variant="outline" onClick={close}>Cancel</Button>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        leftSection={isLoading && <Loader size={20} />}
                    >
                        Submit
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}