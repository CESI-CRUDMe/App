import { Tabs } from 'expo-router';

export default function StackLayout() {
    return (
        <Tabs>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Articles'
                }}
            />
            <Tabs.Screen
                name="new-article"
                options={{
                    title: 'Nouvel Article'
                }}
            />
        </Tabs>
    );
} 