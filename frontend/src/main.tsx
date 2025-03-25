import { createRoot } from "react-dom/client";
import { AuthProvider } from "@components/AuthProvider";
import { CssLoader } from "@components/CssLoader";
import {
    ActionIcon,
    Button,
    Checkbox,
    createTheme,
    Loader,
    MantineProvider,
    NumberInput,
    Slider,
    Textarea,
    TextInput,
} from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import styles from "@/theme.module.scss";
import "@mantine/core/styles.css";
import "./index.css";

const theme = createTheme({
    components: {
        Button: Button.extend({
            defaultProps: {
                color: styles.dark,
                radius: 10,
            },
        }),
        ActionIcon: ActionIcon.extend({
            defaultProps: {
                color: styles.dark,
            },
        }),
        TextInput: TextInput.extend({
            defaultProps: {
                classNames: { input: styles.input },
            },
        }),
        NumberInput: NumberInput.extend({
            defaultProps: {
                classNames: { input: styles.input },
            },
        }),
        Textarea: Textarea.extend({
            defaultProps: {
                classNames: { input: styles.input },
            },
        }),
        Checkbox: Checkbox.extend({
            defaultProps: {
                color: styles.dark,
            },
        }),
        Loader: Loader.extend({
            defaultProps: {
                loaders: { ...Loader.defaultLoaders, custom: CssLoader },
                color: styles.dark,
                type: "custom",
            },
        }),
        Slider: Slider.extend({
            defaultProps: {
                color: styles.dark,
            },
        }),
    },
});

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <MantineProvider theme={theme}>
            <RouterProvider router={router} />
        </MantineProvider>
    </AuthProvider>
);
