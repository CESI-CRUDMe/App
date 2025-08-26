import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const JWTContext = createContext({
    token: null as string | null,
    refreshToken: null as string | null,
    refreshAccessToken: async () => { return "" as string }
});

export const JWTProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    const refreshAccessToken = async (): Promise<string> => {
        const response = await axios.post('https://api.crudme.mindlens.fr/jwt/refresh', {
            refreshToken: process.env.EXPO_PUBLIC_JWT_REFRESH_KEY
        });
        setRefreshToken(response.data.token);
        return response.data.token;
    }
    const saveRefreshToken = async (token: string) => {
        await AsyncStorage.setItem('refreshToken', token);
    }
    
    useEffect(() => {
        if (refreshToken === null) {
            refreshAccessToken();
        } else {
            saveRefreshToken(refreshToken);
        }
    }, [refreshToken]);

    return (
        <JWTContext.Provider value={{ 
            token, 
            refreshToken,
            refreshAccessToken
        }}>
            {children}
        </JWTContext.Provider>
    );
}

export const useJWT = () => {
    const context = useContext(JWTContext);
    if (!context) {
        throw new Error('useJWT must be used within a JWTProvider');
    }
    return context;
}