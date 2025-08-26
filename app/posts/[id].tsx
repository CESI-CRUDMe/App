import PostScreen from "@/screens/PostScreen";
import { Stack } from "expo-router";

export default function PostTab() {
    return (
        <>
            <Stack.Screen options={{ headerShown: true, title: "Post", headerBackTitle: "Retour" }} />
            <PostScreen />
        </>
    );
}