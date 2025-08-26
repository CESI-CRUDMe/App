import Post from '@/components/Post';
import { useUser } from '@/providers/AuthProvider';
import PostType from '@/types/PostType';
import axios from 'axios';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostsScreen() {
    const { username, isGuest, isLogged, accessToken } = useUser();

    const [posts, setPosts] = useState<PostType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastID, setLastId] = useState<string>('-1');
    const [pageSize, setPageSize] = useState<string>('10');

    const [loadingPosts, setLoadingPosts] = useState(false);

    const fetchPosts = async () => {
        setError(null);
        try {
            const res = await axios.get('http://localhost:3000/api/posts', {
                params: { limit: pageSize, lastID: lastID }
            });

            const data = Array.isArray(res.data) ? res.data : (res.data?.posts || []);

            if(data.length === 0) return; // Pas de nouveaux posts

            setLastId(data[data.length - 1].id);
            setPosts((prev) => {
                let postsIds = new Set(prev.map(p => p.id));
                let new_posts = data.filter((item: PostType) => !postsIds.has(item.id));
                return [...prev, ...new_posts];
            });
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Erreur lors du chargement des posts');
        } finally {
            setLoadingPosts(false);
        }
    };




    if (loadingPosts && posts.length === 0) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenue {username}</Text>
                <Text style={styles.status}>Statut: {isGuest ? 'Invité' : (isLogged ? 'Connecté' : 'Non connecté')}</Text>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Post post={item} />
                )}
                contentContainerStyle={posts.length === 0 ? styles.emptyContainer : undefined}
                ListEmptyComponent={!loadingPosts && !error ? <Text>Aucun post.</Text> : null}
                onEndReached={fetchPosts}
                onEndReachedThreshold={0.4}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { marginBottom: 12 },
    title: { fontSize: 22, fontWeight: '600', marginBottom: 4 },
    status: { fontSize: 14, color: '#555' },
    error: { color: 'red', marginBottom: 12 },
    postCard: { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 12 },
    postTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    postContent: { fontSize: 14, color: '#333' },
    emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
});
