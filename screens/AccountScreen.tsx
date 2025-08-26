import { useUser } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

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

                <Text style={styles.title}>🎉 Bienvenue sur votre compte administrateur ! 👑</Text>
                <Button title="Déconnexion" onPress={handleLogout} />
            </View>
        );
    } else if (isGuest) {
        return (
            <View style={styles.container}>

                <Text style={styles.title}>🎉 Bienvenue invité ! 🌟</Text>
                <Button title="Ce connecté en administrateur" onPress={handleLogout} />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>

                <Text style={styles.title}>Tu es pas censé etre la toi ...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
    },
});