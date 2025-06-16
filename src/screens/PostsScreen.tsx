import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { Link } from "expo-router";
import Post from "@/components/Post";

export default function PostsScreen() {

    const [posts, setPosts] = useState([]);

    const { token } = useAuth();

    axios.get(process.env.EXPO_PUBLIC_API_URL + `/posts?page=1&limit=10`, {
            headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        setPosts(res.data.posts);
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.list}>
            {posts.map((post: any) => (
                <Link href={`/post/${post.id}`} key={post.id}>
                    <Post post={post} />
                </Link>
            ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        width: '100%',
        flex: 1,
        alignItems: 'center',
    },
    list: {
        width: '100%',
    },
});