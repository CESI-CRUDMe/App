import { Button, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
export default function PostScreen() {   
    const { id } = useLocalSearchParams();
    return (
        <View style={styles.container}>
                <Stack.Screen options={{ headerTitle: post.title.toString(), headerBackTitle: "Retour" }} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        padding: 12,
    },
})