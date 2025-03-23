import { useState } from "react";
import { Button, Image, TextInput, Textarea, Stack, Alert, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { deleteProject, updateProject } from "@shared/api/project";
import DeleteIcon from "@assets/icons/delete.svg";
import SaveIcon from "@assets/icons/save.svg";
import { useProjectStore } from "@shared/store";
import { useForm } from "@mantine/form";
import { ProjectType } from "@shared/types/project";
import { NotFoundRequestType } from "@shared/types";

type MessageType = {
    text: string
    type: "Success" | "Error"
}

export const Settings = () => {
    const { id, title, description } = useProjectStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState<MessageType>();
    const navigate = useNavigate();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            id,
            title,
            description,
        },
    });

    const submitHandler = async (props: Omit<ProjectType, "id" | "content" | "lastUpdate">) => {
        setMessage(undefined);
        setIsUpdating(true);
        const { status, data } = await updateProject(props);
        if (status === 200) {
            useProjectStore.setState(data as ProjectType);
            setMessage({ text: "Successfuly saved!", type: "Success" });
        } else {
            const message = (data as NotFoundRequestType).message;
            console.error(message);
            setMessage({ text: message, type: "Error" });
        }
        setIsUpdating(false);
    };

    return (
        <Stack p="md">
            <form onSubmit={form.onSubmit(submitHandler)}>
                <Stack gap={10}>
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
                    <Group>
                        <Button
                            variant="outline"
                            onClick={async () => {
                                setIsDeleting(true);
                                const { status } = await deleteProject(Number(id));
                                setIsDeleting(false);
                                if (status === 200) {
                                    navigate("/");
                                }
                            }}
                            disabled={isDeleting || isUpdating}
                            leftSection={<Image src={DeleteIcon} />}
                            loading={isDeleting}
                        >
                            Delete project
                        </Button>
                        <Button
                            disabled={isDeleting || isUpdating}
                            type="submit"
                            leftSection={<Image src={SaveIcon} />}
                            loading={isUpdating}
                        >
                            Save
                        </Button>
                    </Group>
                    {message && <Alert variant="light" color={message.type === "Success" ? "green" : "red"} title={message.type}>{message.text}</Alert>}
                </Stack>
            </form>
        </Stack>
    )
}