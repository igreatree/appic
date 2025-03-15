import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Button, createTheme, MantineProvider } from "@mantine/core";
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
        radius: 12,
      },
    })
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
);
