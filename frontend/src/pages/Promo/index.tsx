import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Title, Text, Image, Space, Group, GroupProps, Button, MantineStyleProp } from "@mantine/core";
import { useIsMobile } from "@shared/utils/hooks/useIsMobile";
import LogoImage from "@assets/images/logo.svg";
import theme from "@/theme.module.scss";

type PromoBlockPropsType = GroupProps & {
    title: string
    description: string
    image: string
    isMobile: boolean
};

const PromoBlock = ({ title, description, image, isMobile, ...props }: PromoBlockPropsType) => {
    return (
        <Group p="xl" {...props} wrap="nowrap" justify={"center"} align={isMobile ? "start" : ""} gap={50}>
            <Image radius="xl" w={isMobile ? "90%" : "50%"} src={image} />
            <Stack>
                <Title order={2}>{title}</Title>
                <Text size="lg">{description}</Text>
            </Stack>
        </Group>
    )
};

export const Promo = () => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const style = useMemo<Record<string, MantineStyleProp>>(() => ({
        a: { flexDirection: isMobile ? "column" : "row" },
        b: { flexDirection: isMobile ? "column" : "row-reverse" }
    }), [isMobile]);

    return (
        <Stack align="center" pb="40vh">
            <Stack gap={0} h={isMobile ? "60vh" : "90vh"} align="center" >
                <Image w={"90vw"} src={LogoImage} style={{ marginTop: "-50%" }} />
                <Title size={"72px"}>Appic</Title>
                <Text size="lg">Simply do it</Text>
            </Stack>
            <Space h="xl" />
            <PromoBlock
                title="Control easily"
                description="Easily add images to the canvas and modify them."
                image="/images/promo1.png"
                style={style.a}
                isMobile={isMobile}
            />
            <Space h="xl" />
            <PromoBlock
                title="Crop freely"
                description="Cut and see the result in action."
                image="/images/promo2.png"
                style={style.b}
                isMobile={isMobile}
            />
            <Space h="xl" />
            <PromoBlock
                title="Change image perspective"
                description="Embed elements by moving each corner independently for perspective."
                image="/images/promo3.png"
                style={style.a}
                isMobile={isMobile}
            />
            <Space h="xl" />
            <Space h="xl" />
            <Button size="xl" color={theme.primary} onClick={() => navigate("/registration")}>Signup for free</Button>
        </Stack>
    )
}