import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import api from "./api.ts"
import Cookies from 'js-cookie';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    };
    return authContext;
}

interface AuthContextType {
    token: string | null | undefined;
    setToken: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    //If NULL, we have checked if logged in
    //If UNDEFINED, we have to check if logged in
    //If string, we are propably logged in
    const [token, setToken] = useState<string | null | undefined>(undefined);
    
    useEffect(() => {

        const fetchMe = async () => {
            const userId = Cookies.get('UserId');
            try {
                const response = await api.post("/auth/refresh", {
                    UserId: userId
                }, {
                    withCredentials: true
                });
                setToken(response.data.token);
            } catch {
                setToken(null);
            }
        };
        fetchMe();
    }, [])

    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use((config: any) => {
            config.headers.Authorization =
                !config._retry && token
                    ? `Bearer ${token}`
                    : config.headers.Authorization;
            return config;
        });

        return () => {
            api.interceptors.request.eject(authInterceptor);
        }

    }, [token]);

    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                try {

                    if (error.response.status === 403) {
                        try {
                            const userId = Cookies.get('UserId');
                            const response = await api.post("/auth/refresh", { params: { UserId: userId } });

                            setToken(response.data.token);

                            originalRequest.headers.Authorization = `Bearer ${response.data.Token}`;
                            originalRequest._retry = true;

                            return api(originalRequest);

                        } catch {
                            setToken(null);
                        }
                    }
                } catch {
                    setToken(null);
                }

                //return Promise.reject(error);
            })
        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};