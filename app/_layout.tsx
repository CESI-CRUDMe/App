import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { Stack, Tabs, useNavigationContainerRef } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from "expo";

const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
    dsn: 'https://34cc2490893fbad40eec1c677191ee7c@o4509508763516928.ingest.de.sentry.io/4509510508544080',

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Configure Session Replay
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 1.0,
    integrations: [Sentry.mobileReplayIntegration({
        maskAllText: false,
        maskAllImages: false,
        maskAllVectors: false,
      }), Sentry.feedbackIntegration(), navigationIntegration],
    enableNativeFramesTracking: !isRunningInExpoGo(),

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

function RootLayoutNav() {
    const { fetchToken } = useAuth();

    useEffect(() => {
        fetchToken();
    }, []);

    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="posts/[id]"
                options={{
                    headerShown: true,
                    title: 'Article',
                }}
            />
        </Stack>
    );
}

export default Sentry.wrap(function RootLayout() {


    const ref = useNavigationContainerRef();
    React.useEffect(() => {
        if (ref) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ref]);

    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
});