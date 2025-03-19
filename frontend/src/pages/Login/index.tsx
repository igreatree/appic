import { AuthPropsType } from "@shared/api/auth";
import { Button, Group, TextInput, Title, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@components/AuthProvider";

export const Login = () => {
    const [error, setError] = useState<string>();
    const { login } = useAuth();
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

    const submitHandler = async (props: AuthPropsType) => {
        const errorMessage = await login(props);
        errorMessage ? setError(errorMessage) : navigate("/");
    };

    return (
        <Stack p="lg" align="center" justify="center" h="100vh">
            <Title>Login</Title>
            <form onSubmit={form.onSubmit(submitHandler)}>
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
                {error && <Text mt={20} c="red">{error}</Text>}
            </form>
        </Stack>
    );
}