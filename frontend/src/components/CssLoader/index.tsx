import { forwardRef } from "react";
import { Box, MantineLoaderComponent } from "@mantine/core";
import cx from "clsx";
import styles from "./cssLoader.module.scss";

export const CssLoader: MantineLoaderComponent = forwardRef(({ className, ...others }, ref) => (
    <Box component="span" className={cx(styles.loader, className)} {...others} ref={ref} />
));