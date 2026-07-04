
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme'

export const LoadingSpinner = () => (
    <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
);

export const EmptyState = ({ message = "No hay datos disponibles" }) => (
    <View style={styles.center}>
        <Text style={styles.emptyText}>{message}</Text>
    </View>
);

export const Card = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
)

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 150,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: 16,
        marginVertical: SPACING.sm,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptyText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        textAlign: "center",
        fontWeight: "500",
    },
});