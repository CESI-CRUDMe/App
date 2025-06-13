import { View, StyleSheet } from "react-native";

export default function Card({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.card}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        width: "75%",
    },
});