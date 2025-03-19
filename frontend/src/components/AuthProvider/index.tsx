import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authCheck, AuthPropsType, login as loginReq } from "@shared/api/auth";
import { BadRequestType, UserType, UserTypeWithToken } from "@shared/types";

type AuthProviderPropsType = {
    children: ReactNode
};

type ContextType = {
    user: UserType | null
    login: (props: AuthPropsType) => Promise<string | null>
    logout: () => void
    isLoading: boolean
};

const AuthContext = createContext<ContextType>(null as unknown as ContextType);

export const AuthProvider = ({ children }: AuthProviderPropsType) => {
    const [user, setUserState] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setUser = (val: UserType) => {
        const localUser = localStorage.getItem("user");
        if (!user || user.id !== val.id) setUserState(val);
        if (!localUser || JSON.parse(localUser).id !== val.id) localStorage.setItem("user", JSON.stringify(val));
        setIsLoading(false);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUserState(null);
        setIsLoading(false);
    };

    const login = async (props: AuthPropsType): Promise<string | null> => {
        const res = await loginReq(props);
        if (res.status === 201) {
            const { access_token, ...user } = res.data as UserTypeWithToken
            localStorage.setItem("token", access_token);
            setUser(user);
            return null;
        } else {
            logout();
            return ((res.data as BadRequestType).message);
        }
    };

    useEffect(() => {
        const authEffect = async () => {
            const { status, data } = await authCheck();
            status === 200 ? setUser(data as UserType) : logout();
        };
        authEffect();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
