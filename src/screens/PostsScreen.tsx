import { SafeAreaView, StyleSheet } from "react-native";
import { Text } from "react-native";

export default function PostsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PostsScreen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});