import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
            try {
                // Using fetch API instead of axios
                const response = await fetch("/api/auth/refresh", {
                    method: 'POST', // Specify the method
                    credentials: 'include', // Handles withCredentials: true
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    // Handle non-2xx responses
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseJson = await response.json(); // Parse the JSON response
                // Access the token property directly from the parsed JSON
                setToken(responseJson.token);

            } catch (error) {
                // Handle network errors or errors thrown above
                console.error("Failed to fetch or parse refresh token:", error);
                setToken(null);
            }
        };
        fetchMe();
    }, [])

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};