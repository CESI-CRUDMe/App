import { createContext, useContext, useState } from "react";
import axios from "axios";

interface AuthContextType {
    token: string | null;
    refreshToken: string | null;
    fetchToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    refreshToken: null,
    fetchToken: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const fetchToken = async () => {
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/jwt`,
                { token: process.env.EXPO_PUBLIC_JWT_REFRESH_KEY }
            );
            
            setToken(response.data.token);
            setRefreshToken(response.data.refreshToken);
        } catch (error: any) {            
            setToken(null);
            setRefreshToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ token, refreshToken, fetchToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};