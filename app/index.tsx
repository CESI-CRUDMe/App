import Post from '@/components/Post';
import { Link } from 'expo-router';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Page() {

    const { data, error, isLoading } = useSWR('https://api.crudme.mindlens.fr/posts', fetcher);

    if (isLoading) return <Text>Chargement...</Text>;
    if (error) return <Text>Erreur : {error.message}</Text>;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.list}>
                {data.posts.map((post: any) => (
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
    }
});