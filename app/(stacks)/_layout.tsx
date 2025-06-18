import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="posts/[id]"
                options={{
                    headerShown: true,
                    headerBackTitle: 'Retour',
                    title: 'Article',
                }}
            />
        </Stack>
    );
} 