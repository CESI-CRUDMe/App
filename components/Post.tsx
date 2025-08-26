import PostType from '@/types/PostType';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Post({ post }: { post: PostType }) {

    const router = useRouter();

    return (
        <Link
            style={styles.postCard}
            href={`/posts/${post.id}`}
        >
            <View>
                <Text style={styles.postTitle}>{post.title || `Post #${post.id}`}</Text>
                {post.content && <Text style={styles.postContent}>{post.content}</Text>}
            </View>
        </Link>
    );
}

const styles = StyleSheet.create({
    postCard: { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 12 },
    postTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    postContent: { fontSize: 14, color: '#333' },
});