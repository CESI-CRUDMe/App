import { useUser } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

export default function AccountScreen() {


    const { logout } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };



    return (
        <View style={styles.container}>
            <Button title="Déconnexion" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});