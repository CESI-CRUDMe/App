import PostsTabScreen from "@/screens/PostsScreen";
import { useLocalSearchParams } from 'expo-router';
import React from "react";

export default function PostsTab() {
    const { flash, msg } = useLocalSearchParams<{ flash?: string; msg?: string }>();
    return <PostsTabScreen flash={flash as string | undefined} msg={msg as string | undefined} />;
}