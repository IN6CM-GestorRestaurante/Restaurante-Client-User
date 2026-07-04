// src/features/tables/screens/TablesScreen.jsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTables } from "../hooks/useTables";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const TablesScreen = ({ navigation }) => {
    const { tables, loading, error, refetch } = useTables();

    if (loading && tables.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mesas</Text>
                <Text style={styles.subtitle}>Selecciona una mesa para reservar</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />
                }
            >
                {error ? (
                    <EmptyState message={error} />
                ) : tables.length === 0 ? (
                    <EmptyState message="No hay mesas disponibles" />
                ) : (
                    tables.map((table) => (
                        <TouchableOpacity
                            key={table.id}
                            onPress={() => navigation.navigate("TableDetail", { tableId: table.id })}
                            activeOpacity={0.7}
                        >
                            <Card style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.statusIndicator, table.isAvailable ? styles.available : styles.occupied]} />
                                    <Text style={styles.tableNumber}>Mesa {table.number}</Text>
                                    <MaterialIcons
                                        name={table.isAvailable ? "check-circle" : "cancel"}
                                        size={24}
                                        color={table.isAvailable ? COLORS.success : COLORS.error}
                                    />
                                </View>
                                <View style={styles.cardBody}>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="people" size={18} color={COLORS.secondary} />
                                        <Text style={styles.infoText}>Capacidad: {table.capacity} personas</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="location-on" size={18} color={COLORS.secondary} />
                                        <Text style={styles.infoText}>{table.location}</Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: FONT_SIZE.huge,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: SPACING.xs,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        fontWeight: "500",
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    card: {
        marginBottom: SPACING.md,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.md,
    },
    statusIndicator: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: SPACING.sm,
    },
    available: {
        backgroundColor: COLORS.success,
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    occupied: {
        backgroundColor: COLORS.error,
        shadowColor: COLORS.error,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    tableNumber: {
        flex: 1,
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.text,
    },
    cardBody: {
        gap: SPACING.sm,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        backgroundColor: COLORS.surfaceVariant,
        padding: SPACING.sm,
        borderRadius: 8,
    },
    infoText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        fontWeight: "500",
    },
});

export default TablesScreen;
