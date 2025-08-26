// filepath: /Users/teomullerheddar/Documents/projets/CRUDMe/App/app/(app)/dashboard.tsx
import { useUser } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function DashboardScreen() {
    const { username, logout, isGuest, isLogged } = useUser();

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        /*<View style={styles.container}>
          <Text style={styles.title}>Bienvenue {username}</Text>
          <Text style={styles.status}>Statut: {isGuest ? 'Invité' : (isLogged ? 'Connecté' : 'Non connecté')}</Text>
          {!isGuest && isLogged && (
            <Button title="Se déconnecter" onPress={handleLogout} />
          )}
          {isGuest && (
            <Button title="Retour à la connexion" onPress={handleLogout} />
          )}
        </View>*/
        <></>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
    status: { fontSize: 16, marginBottom: 24 },
});
