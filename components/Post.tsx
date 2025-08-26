import { colors, radii, shadows } from '@/constants/theme';
import PostType from '@/types/PostType';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Post({ post }: { post: PostType }) {

    const router = useRouter();

    return (
        <Link
            style={styles.postCard}
            href={`/posts/${post.id}`}
            asChild
        >
            <Pressable android_ripple={{ color: colors.border }}>
                <View style={styles.indicator} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.postTitle}>{post.title || `Post #${post.id}`}</Text>
                    {post.content && <Text style={styles.postContent}>{post.content}</Text>}
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    postCard: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: colors.card, borderRadius: radii.md, marginBottom: 14, borderWidth: 1, borderColor: colors.border, ...shadows.card },
    indicator: { width: 6, borderRadius: radii.xs, backgroundColor: colors.primary, marginRight: 12 },
    postTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: colors.text },
    postContent: { fontSize: 14, color: colors.subText },
});