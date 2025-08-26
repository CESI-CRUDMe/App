import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { JWTProvider } from '@/providers/JWTProvider';

export function AppLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Articles',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="list" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="new-article"
                options={{
                    title: 'Nouvel Article',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="plus" size={24} color={color} />
                    ),
                }}
            />

            {/* On cache la tab de la stack des articles */}
            <Tabs.Screen
                name="(stacks)"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
        </Tabs>
    );
}

export default function RootLayout() {
    return (
        <JWTProvider>
            <AppLayout />
        </JWTProvider>
    )
}