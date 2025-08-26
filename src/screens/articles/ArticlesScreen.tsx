import Post from '@/components/Post';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import useSWR from 'swr';
import { useJWT } from '@/providers/JWTProvider';
import axios from 'axios';


export default function ArticlesScreen() {
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const { token } = useJWT();

    const fetcher = async (url: string) => {
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        });
        return response.data;
    };
    const { data, error, isLoading } = useSWR('https://api.crudme.mindlens.fr/posts?page=1&limit=15', fetcher);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;
        const isScrolled80Percent =
            (layoutMeasurement.height + contentOffset.y) >=
            (contentSize.height * 0.8 - paddingToBottom);

        if (isScrolled80Percent && !isLoading && hasMore) {
            setPage(page + 1);
        }
    };

    if (error) return <Text>Erreur : {error.message}</Text>;
    if (isLoading) return <Text>Chargement...</Text>;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.list}
                onScroll={handleScroll}
                scrollEventThrottle={400}
            >
                {posts.map((post: any) => (
                    <Link href={`/post/${post.id}`} key={post.id}>
                        <Post post={post} />
                    </Link>
                ))}
                {isLoading && hasMore && <Text style={styles.loading}>Chargement...</Text>}
                {!hasMore && (
                    <Text style={styles.endMessage}>Vous avez tout vu !</Text>
                )}
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
    loading: {
        padding: 10,
        textAlign: 'center'
    },
    endMessage: {
        padding: 10,
        textAlign: 'center',
        color: '#666'
    }
});