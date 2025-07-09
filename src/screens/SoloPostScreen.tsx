import { Stack, useFocusEffect } from "expo-router";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import { useCallback, useState } from "react";
import axios from "axios";
import * as Sentry from '@sentry/react-native';

export default function SoloPostScreen(props: { id: string }) {
    const { id } = props;
    const [post, setPost] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    useFocusEffect(
        useCallback(() => {
            if (id) {
                axios.get(`${process.env.EXPO_PUBLIC_API_URL}/posts/${id}`)
                    .then((res) => setPost(res.data.post))
                    .catch((err) => Sentry.captureException(err));
            }
        }, [id])
    );

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ headerTitle: "Article" }} />
            <View style={styles.content}>
                <Text style={styles.title}>{post?.title}</Text>
                <View style={styles.calendar}>
                    <Text style={styles.calendarText}>{post?.created_at}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{isExpanded ? post?.content : post?.content.slice(0, 100) + "..."}</Text>
                    <Button title={isExpanded ? "Voir Moins" : "Voir Plus"} onPress={toggleContent} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        padding: 12,
    },
    content: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 20,
    },
    calendar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    calendarText: {
        fontSize: 16,
        color: "#000",
    },
    contentContainer: {
        marginTop: 20,
    },
    contentText: {
        fontSize: 16,
        color: "#000",
        textAlign: "justify",
    }
})