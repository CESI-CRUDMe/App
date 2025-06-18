import { createContext, useContext, useState } from "react";
import axios from "axios";
import AuthContextType from "@/types/AuthContextType";

export const AuthContext = createContext<AuthContextType>({
    token: null,
    fetchToken: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    const fetchToken = async () => {
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/jwt`,
                { token: process.env.EXPO_PUBLIC_JWT_REFRESH_KEY }
            );
            
            setToken(response.data.token);
        } catch (error: any) {            
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ token, fetchToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};