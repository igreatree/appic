import { Button, Checkbox, Group, TextInput, Title, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
        },
    });

    return (
        <Stack p="lg" align="center" justify="center" h="100vh">
            <Title>Login</Title>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                />
                <TextInput
                    type="password"
                    withAsterisk
                    label="Password"
                    placeholder="your password"
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                />
                <Group justify="space-between" mt="md">
                    <Button variant="outline" onClick={() => navigate("/registration")}>Registration</Button>
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Stack>
    );
}