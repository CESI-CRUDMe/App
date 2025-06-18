import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react-native';
import { useFocusEffect } from '@react-navigation/native';

interface UseApiConfig<T> extends Omit<AxiosRequestConfig, 'url'> {
    url: string;
    token: string | null;
    fetchToken: () => void;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    enabled?: boolean;
}

interface UseApiResponse<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useApi<T = any>({
    url,
    token,
    fetchToken,
    method = 'GET',
    onSuccess,
    onError,
    enabled = true,
    ...config
}: UseApiConfig<T>): UseApiResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!token || !enabled) return;

        setLoading(true);
        setError(null);

        try {
            const response: AxiosResponse<T> = await axios({
                url: `${process.env.EXPO_PUBLIC_API_URL}${url}`,
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...config.headers,
                },
                ...config,
            });

            setData(response.data);
            onSuccess?.(response.data);
        } catch (err: any) {
            if (err.response?.status === 498) {
                fetchToken();
            } else {
                const errorMessage = err.response?.data?.message || 'Une erreur est survenue';
                setError(errorMessage);
                onError?.(err);
                Sentry.captureException(err);
            }
        } finally {
            setLoading(false);
        }
    }, [url, token, method, config, enabled, onSuccess, onError, fetchToken]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
} 