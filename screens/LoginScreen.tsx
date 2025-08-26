// filepath: /Users/teomullerheddar/Documents/projets/CRUDMe/App/app/(auth)/login.tsx
import { colors, radii, shadows } from '@/constants/theme';
import { useUser } from '@/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
    const { login, guestLogin } = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        const ok = await login(username.trim(), password);
        setSubmitting(false);
        if (ok) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Erreur', 'Identifiants invalides');
        }
    };

    const onGuest = () => {
        guestLogin();
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}> 
                <Text style={styles.headerTitle}>CRUDMe</Text>
                <Text style={styles.headerSubtitle}>Connectez-vous pour continuer</Text>
            </LinearGradient>
            <View style={styles.formCard}>
                <Text style={styles.title}>Connexion</Text>
                <TextInput
                    placeholder="Nom d'utilisateur"
                    placeholderTextColor={colors.subText}
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Mot de passe"
                    placeholderTextColor={colors.subText}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />
                <Pressable onPress={onSubmit} disabled={submitting} style={[styles.button, submitting && { opacity: 0.7 }]}> 
                    <Text style={styles.buttonText}>{submitting ? 'Connexion...' : 'Se connecter'}</Text>
                </Pressable>
                <Pressable onPress={onGuest} style={[styles.button, styles.secondaryButton]}> 
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>Continuer en invité</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 120, paddingBottom: 60, paddingHorizontal: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, ...shadows.card },
    headerTitle: { fontSize: 40, fontWeight: '800', color: '#fff', marginBottom: 8 },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
    formCard: { marginTop: -40, marginHorizontal: 24, backgroundColor: colors.card, borderRadius: radii.lg, padding: 24, borderWidth: 1, borderColor: colors.border, ...shadows.card },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 22, color: colors.text, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', borderRadius: radii.md, padding: 14, marginBottom: 14, fontSize: 16, color: colors.text },
    baseButton: { paddingVertical: 14, borderRadius: radii.pill, alignItems: 'center' },
    button: { backgroundColor: colors.primary, ...Platform.select({ default: {} }), borderRadius: radii.pill, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, marginTop: 14, borderRadius: radii.pill },
    secondaryButtonText: { color: colors.primary },
});
