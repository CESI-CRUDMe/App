// filepath: /Users/teomullerheddar/Documents/projets/CRUDMe/App/app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthStackLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="login" options={{ title: 'Connexion' }} />
    </Stack>
  );
}
