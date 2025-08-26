import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance } from 'axios';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Types du contexte
export type AuthContextType = {
    username: string | null;
    isLogged: boolean;
    isGuest: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    guestLogin: () => void;
    logout: () => Promise<void>;
    accessToken: string | null;
};

// Valeur par défaut
const defaultContext: AuthContextType = {
    username: null,
    isLogged: false,
    isGuest: false,
    loading: true,
    login: async () => false,
    guestLogin: () => { },
    logout: async () => { },
    accessToken: null,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

// Clés de stockage
const ACCESS_TOKEN_KEY = 'accessToken';
const USERNAME_KEY = 'username';
const GUEST_MODE_KEY = 'guestMode';

const createApiClient = (getAccessToken: () => string | null, onUnauthorized: () => Promise<void>): AxiosInstance => {
    const api = axios.create({ baseURL: 'http://localhost:3000/api' });

    api.interceptors.request.use((config) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
            if (error.response?.status === 401) {
                await onUnauthorized();
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [guestMode, setGuestMode] = useState(false); // ajouté

    const getAccessToken = useCallback(() => accessToken, [accessToken]);

    const logout = useCallback(async () => {
        setUsername(null);
        setAccessToken(null);
        setGuestMode(false);
        await Promise.all([
            AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
            AsyncStorage.removeItem(USERNAME_KEY),
            AsyncStorage.removeItem(GUEST_MODE_KEY),
        ]);
    }, []);

    const apiRef = useRef<AxiosInstance | null>(null);
    if (!apiRef.current) {
        apiRef.current = createApiClient(getAccessToken, logout);
    }

    const loadSession = useCallback(async () => {
        try {
            const [storedAccess, storedUsername, storedGuest] = await Promise.all([
                AsyncStorage.getItem(ACCESS_TOKEN_KEY),
                AsyncStorage.getItem(USERNAME_KEY),
                AsyncStorage.getItem(GUEST_MODE_KEY),
            ]);
            if (storedAccess && storedUsername) {
                setAccessToken(storedAccess);
                setUsername(storedUsername);
                setGuestMode(false);
            } else if (storedGuest === 'true') {
                setGuestMode(true);
                setUsername('Invité');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSession();
    }, [loadSession]);

    const login = useCallback(async (user: string, password: string): Promise<boolean> => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth', { username: user, password });
            const access = res.data?.accessToken;
            if (!access) return false;
            setUsername(user);
            setAccessToken(access);
            setGuestMode(false);
            await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
            await AsyncStorage.setItem(USERNAME_KEY, user);
            return true;
        } catch (error) {
            return false;
        }
    }, []);

    const guestLogin = useCallback(() => {
        setGuestMode(true);
        setUsername('Invité');
        setAccessToken(null);
        AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
    }, []);

    const value: AuthContextType = {
        username,
        isLogged: !!accessToken,
        isGuest: guestMode,
        loading,
        login,
        guestLogin,
        logout,
        accessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUser = () => useContext(AuthContext);