import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useSWR from "swr";
import { useState } from "react";

export default function PostScreen(props: { id: string }) {   
    const { id } = props;
    
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    }

    const fetcher = (url: string) => fetch(url).then(res => res.json());

    const { data, error, isLoading } = useSWR(`https://api.crudme.mindlens.fr/posts?id=${id}`, fetcher);

    if (isLoading) return <Text>Chargement...</Text>;
    if (error || !data) return <Text>Erreur : {error?.message}</Text>;

    const post = data.post;

    const calendar = <Ionicons name="calendar" size={24} color="dark" />;

    return (
        <ScrollView style={styles.container}>
                <Stack.Screen options={{ headerTitle: post.title.toString(), headerBackTitle: "Retour" }} />
            <View style={styles.content}>
                <Text style={styles.title}>{post.title}</Text>
                <View style={styles.calendar}>
                    {calendar}
                    <Text style={styles.calendarText}>{post.created_at}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{isExpanded ? post.content : post.content.slice(0, 100) + "..."}</Text>
                    <Button title={isExpanded ? "Voir Moins" : "Voir Plus"} onPress={toggleContent} />
                </View>
            </View>
        </ScrollView>
    )
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