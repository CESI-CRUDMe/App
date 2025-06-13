import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface TouchButtonProps extends TouchableOpacityProps {
    isRounded?: boolean;
}

export default function TouchButton(props: TouchButtonProps) {
    return (
        <TouchableOpacity {...props} style={[styles.button, props.isRounded && styles.rounded]} >
            <Text style={styles.buttonText}>{props.children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#406AB5",
        padding: 12,
        borderRadius: 4,
        marginTop: 6,
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },

    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },

    rounded: {
        borderRadius: 100,
    },
});