// src/features/tables/screens/TablesScreen.jsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTables } from "../hooks/useTables";
import { useBranchStore } from "../../branches/store/branchStore";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const TablesScreen = ({ navigation }) => {
    const { selectedBranch: branch, loading: loadingBranch } = useBranchStore();
    const { tables, loading, error, refetch } = useTables(branch?._id || branch?.id);

    if ((loading || loadingBranch) && tables.length === 0) {
        return <LoadingSpinner />;
    }

    if (!branch) {
        return (
            <View style={styles.container}>
                <EmptyState message="Selecciona un restaurante primero desde la pestaña Restaurantes" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md, marginBottom: SPACING.xs }}>
                            <TouchableOpacity onPress={() => navigation.openDrawer && navigation.openDrawer()} activeOpacity={0.7}>
                                <MaterialIcons name="menu" size={32} color={COLORS.primary} />
                            </TouchableOpacity>
                            {navigation.canGoBack() && (
                                <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
                                    <MaterialIcons name="arrow-back" size={28} color={COLORS.primary} />
                                </TouchableOpacity>
                            )}
                            <Text style={[styles.title, { marginBottom: 0 }]}>Mesas</Text>
                        </View>
                        <Text style={styles.subtitle}>Selecciona una mesa para reservar</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.historyButton}
                        onPress={() => navigation.navigate("MyReservations")}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="event-note" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
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
                            onPress={() => navigation.navigate("CreateReservation", {
                                tableId: table.id,
                                tableNumber: table.number,
                                branchId: branch?._id || branch?.id,
                            })}
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
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    historyButton: {
        padding: SPACING.md,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceVariant,
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
