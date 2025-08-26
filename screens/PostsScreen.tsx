import Post from '@/components/Post';
import { colors, radii, shadows } from '@/constants/theme';
import { useUser } from '@/providers/AuthProvider';
import PostType from '@/types/PostType';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostsScreen() {
    const { username, isGuest, isLogged, accessToken } = useUser();

    const [posts, setPosts] = useState<PostType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastID, setLastId] = useState<string>('-1');
    const [pageSize, setPageSize] = useState<string>('10');
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = async (isRefresh = false) => {
        if (loadingPosts) return;
        if (isRefresh) {
            setRefreshing(true);
            setLastId('-1');
        } else {
            setLoadingPosts(true);
        }
        setError(null);
        try {
            const res = await axios.get('https://crudme.mindlens.fr/api/posts', {
                params: { limit: pageSize, lastID: isRefresh ? '-1' : lastID }
            });
            const data = Array.isArray(res.data) ? res.data : (res.data?.posts || []);
            if (isRefresh) {
                setPosts(data);
            } else if (data.length) {
                setLastId(data[data.length - 1].id);
                setPosts((prev) => {
                    const ids = new Set(prev.map(p => p.id));
                    const np = data.filter((p: PostType) => !ids.has(p.id));
                    return [...prev, ...np];
                });
            }
            if (!isRefresh && data.length) setLastId(data[data.length - 1].id);
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Erreur lors du chargement des posts');
        } finally {
            setLoadingPosts(false);
            setRefreshing(false);
        }
    };

    const fetchPosts = useCallback(() => load(false), [lastID, pageSize, loadingPosts]);
    const onRefresh = useCallback(() => load(true), [pageSize]);

    useEffect(() => { if (posts.length === 0) fetchPosts(); }, []);

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
            <FlatList
                ListHeaderComponent={
                    <View style={styles.headerWrapper}>
                        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.hero}>
                            <Text style={styles.heroTitle}>Bienvenue {username}</Text>
                            <View style={styles.badgeRow}>
                                <View style={styles.badge}><Text style={styles.badgeText}>{isGuest ? 'Invité' : (isLogged ? 'Connecté' : 'Hors ligne')}</Text></View>
                                <Pressable onPress={onRefresh} style={styles.refreshBtn}>
                                    <Text style={styles.refreshText}>{refreshing ? '...' : 'Rafraîchir'}</Text>
                                </Pressable>
                            </View>
                        </LinearGradient>
                        {error && <Text style={styles.error}>{error}</Text>}
                    </View>
                }
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Post post={item} />
                )}
                contentContainerStyle={[styles.listContent, posts.length === 0 && !loadingPosts ? styles.emptyContainer : undefined]}
                ListEmptyComponent={!loadingPosts && !error ? <Text style={{ color: colors.subText }}>Aucun post.</Text> : null}
                onEndReached={fetchPosts}
                onEndReachedThreshold={0.4}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    headerWrapper: { paddingHorizontal: 20, paddingTop: 10, marginBottom: 10 },
    hero: { padding: 20, borderRadius: radii.lg, ...shadows.card },
    heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12 },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    badgeText: { color: '#fff', fontWeight: '600' },
    refreshBtn: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
    refreshText: { color: colors.primary, fontWeight: '600' },
    error: { color: colors.danger, marginTop: 12, fontWeight: '600' },
    listContent: { padding: 20, paddingTop: 0 },
    emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
});
