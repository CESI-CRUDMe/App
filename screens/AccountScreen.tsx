import { colors, radii, shadows } from '@/constants/theme';
import { useUser } from '@/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AccountScreen() {

    const { logout, isLogged, isGuest } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    if(isLogged) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
                    <Text style={styles.headerTitle}>Mon Compte</Text>
                    <View style={styles.badge}><Text style={styles.badgeText}>Administrateur</Text></View>
                </LinearGradient>
                <View style={styles.card}>
                    <Text style={styles.title}>🎉 Bienvenue sur votre compte administrateur ! 👑</Text>
                    <Pressable onPress={handleLogout} style={styles.button}><Text style={styles.buttonText}>Déconnexion</Text></Pressable>
                </View>
            </View>
        );
    } else if (isGuest) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
                    <Text style={styles.headerTitle}>Mon Compte</Text>
                    <View style={styles.badge}><Text style={styles.badgeText}>Invité</Text></View>
                </LinearGradient>
                <View style={styles.card}>
                    <Text style={styles.title}>🎉 Bienvenue invité ! 🌟</Text>
                    <Pressable onPress={handleLogout} style={[styles.button, styles.secondaryButton]}><Text style={[styles.buttonText, styles.secondaryButtonText]}>Se connecter en administrateur</Text></Pressable>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
                    <Text style={styles.headerTitle}>Mon Compte</Text>
                    <View style={styles.badge}><Text style={styles.badgeText}>Inconnu</Text></View>
                </LinearGradient>
                <View style={styles.card}>
                    <Text style={styles.title}>Tu n'es pas censé être là...</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 120, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, ...shadows.card },
    headerTitle: { fontSize: 34, fontWeight: '800', color: '#fff', marginBottom: 12 },
    badge: { backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.pill },
    badgeText: { color: '#fff', fontWeight: '600' },
    card: { marginTop: -30, marginHorizontal: 24, backgroundColor: colors.card, borderRadius: radii.lg, padding: 24, borderWidth: 1, borderColor: colors.border, ...shadows.card },
    title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 20, color: colors.text },
    button: { backgroundColor: colors.danger, paddingVertical: 14, borderRadius: radii.pill, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, borderRadius: radii.pill },
    secondaryButtonText: { color: colors.primary },
});