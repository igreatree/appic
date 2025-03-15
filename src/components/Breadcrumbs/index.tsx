import { Box, Button, Breadcrumbs as MantineBreadcrumbs } from "@mantine/core";
import { ReactNode } from "react";
import styles from "./breadcrumbs.module.scss";
import { useNavigate } from "react-router-dom";

type ItemType = {
    title: string,
    href: string,
    leftSection?: ReactNode
}

interface BreadcrumbsProps {
    items: ItemType[]
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    const navigate = useNavigate();

    const elements = items.map(({ title, href, leftSection }, index) => (
        <Button
            key={index}
            className={styles.button}
            variant="white"
            leftSection={leftSection ?? null}
            size="md"
            fw={500}
            onClick={() => navigate(href)}
            p={"0 8px"}
        >
            {title}
        </Button >
    ))

    return <MantineBreadcrumbs className={styles.breadcrumbs} separator={<Box className={styles.separator}>‧</Box>} separatorMargin={0}>
        {elements}
    </MantineBreadcrumbs>
}