import { StyleSheet, TextInput, TextInputProps } from "react-native";

export default function Input(props: TextInputProps) {
    return (
        <TextInput {...props} style={styles.input} />
    )
}   

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 8,
        marginBottom: 12,
    },
});