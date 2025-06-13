import { View, Text, StyleSheet } from "react-native";
const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        fontSize: 14,
    },
    container: {
        width: '100%',
        padding: 8,
    },
    post: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default function Post({ post }: { post: any }) {
    return (
        <View style={styles.container}>
            <View style={styles.post}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.content}>{post.content.slice(0, 100) + "..."}</Text>
            </View>
        </View>
    );
}