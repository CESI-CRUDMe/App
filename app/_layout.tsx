import { Slot, Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, title: "Articles" }} />
            <Stack.Screen name="post/[id]" options={{ headerShown: true }} />
        </Stack>
    );
}