// filepath: /Users/teomullerheddar/Documents/projets/CRUDMe/App/app/(auth)/login.tsx
import { useUser } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

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
      router.replace('/dashboard');
    } else {
      Alert.alert('Erreur', 'Identifiants invalides');
    }
  };

  const onGuest = () => {
    guestLogin();
    router.replace('/dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <View style={styles.buttons}>
        <Button title={submitting ? 'Connexion...' : 'Se connecter'} onPress={onSubmit} disabled={submitting} />
      </View>
      <View style={styles.buttons}>
        <Button title="Continuer en invité" onPress={onGuest} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 14 },
  buttons: { marginBottom: 12 },
});
