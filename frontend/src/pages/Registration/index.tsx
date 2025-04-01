import { AuthPropsType, register } from "@shared/api/auth";
import { Button, Group, TextInput, Title, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadRequestType } from "@shared/types";

export const Registration = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>();
    const [password, setPassword] = useState("");

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            password: (value) => password === value ? null : "Passwords do not match",
        },
    });

    const submitHandler = async (props: AuthPropsType) => {
        const res = await register(props);
        res.status === 201 ? navigate("/login") : setError((res.data as BadRequestType).message);
    };

    return (
        <Stack p="lg" align="center" justify="center" h="100vh">
            <Title>Registration</Title>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextInput
                    type="password"
                    withAsterisk
                    label="Repeat password"
                    placeholder="repeat your password"
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                />
                <Group justify="space-between" mt="md">
                    <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                    <Button type="submit">Submit</Button>
                </Group>
                {error && <Text mt={20} c="red">{error}</Text>}
            </form>
        </Stack>
    );
}