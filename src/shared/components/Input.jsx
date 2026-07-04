import { TextInput, View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme"

const Input = ({ label, error, ...props}) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholderTextColor={COLORS.secondary}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        width: "100%",
    },
    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputError: {
        borderColor: COLORS.error,
        shadowColor: COLORS.error,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    errorText: {
        color: COLORS.error,
        fontSize: FONT_SIZE.xs,
        marginTop: SPACING.xs,
        fontWeight: "500",
    },
});

export default Input;