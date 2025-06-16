import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { Stack } from "expo-router";
import { useEffect } from "react";

function RootLayoutNav() {
    const { fetchToken } = useAuth();

    useEffect(() => {
        fetchToken();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, headerTitle: 'CRUDMe' }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}