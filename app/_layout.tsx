import { AuthProvider, useUser } from '@/providers/AuthProvider';
import { Stack } from "expo-router";
import React from 'react';

function StackLayout() {
    const { isLogged, isGuest } = useUser();

    return (
        <Stack>
            <Stack.Protected guard={!isGuest && !isLogged}>
                <Stack.Screen name="index" options={{ headerShown: false, title: 'Login' }} />
            </Stack.Protected>
            <Stack.Protected guard={isLogged || isGuest}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack >
    )
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <StackLayout />
        </AuthProvider>
    )
}