import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "@mantine/core/styles.css";
import "./index.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
);
