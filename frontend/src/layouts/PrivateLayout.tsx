import { useAuth } from "@components/AuthProvider"
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type PrivateLayoutPropsType = {
    children: ReactNode
}

export const PrivateLayout = ({ children }: PrivateLayoutPropsType) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !isLoading) navigate("/promo");
    }, [user, isLoading]);

    if (!user || isLoading) return null;
    return children
}