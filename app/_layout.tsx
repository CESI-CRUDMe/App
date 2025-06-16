import { Stack } from "expo-router";

function RootLayoutNav() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <RootLayoutNav />
    );
}