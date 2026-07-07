import { TextInput, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";

const Input = ({ label, error, iconName, ...props }) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {iconName && (
                    <MaterialIcons 
                        name={iconName} 
                        size={20} 
                        color={COLORS.text} 
                        style={styles.icon} 
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={COLORS.textLight}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 50,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        overflow: "hidden", // Previene que el texto se salga de la píldora
    },
    icon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        minWidth: 0, // Clave en web para evitar que un flex-item rompa el contenedor
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: FONT_SIZE.xs,
        marginTop: SPACING.xs,
        fontWeight: "500",
        marginLeft: SPACING.md,
    },
});

export default Input;