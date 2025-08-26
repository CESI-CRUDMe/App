import { colors } from '@/constants/theme';
import { useUser } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const { isLogged } = useUser();
    const insets = useSafeAreaInsets();
    const barHeight = 60 + insets.bottom; // dynamic height
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
                tabBarShowLabel: true,
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
                tabBarStyle: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: barHeight,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowColor: 'transparent',
                    borderRadius: 0,
                },
                tabBarItemStyle: {},
                tabBarBackground: () => (
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: 1, borderRadius: 0, paddingBottom: insets.bottom * 0.4 }}
                    />
                ),
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Posts',
                    tabBarIcon: ({ color, focused }) => <Ionicons size={26} name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} />,
                }}
            />
            {/* Utiliser href:null pour masquer totalement l'onglet quand non connecté */}
            <Tabs.Screen
                name="Post"
                options={{
                    href: isLogged ? '/(tabs)/Post' : null, // si pas loggé, retiré de la barre
                    title: 'Post',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons style={{ marginTop: 2 }} size={26} name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Account"
                options={{
                    title: 'Compte',
                    tabBarIcon: ({ color, focused }) => <Ionicons size={26} name={focused ? 'person' : 'person-outline'} color={color} />,
                }}
            />
        </Tabs>
    );
}