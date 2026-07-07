// src/features/bills/screens/BillsScreen.jsx
import React, { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useBills } from "../hooks/useBills";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const BillsScreen = ({ navigation }) => {
    const { bills, loading, error, refetch } = useBills();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    if (loading && bills.length === 0) {
        return <LoadingSpinner />;
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "paid": return COLORS.success;
            case "pending": return COLORS.warning;
            case "cancelled": return COLORS.error;
            default: return COLORS.secondary;
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case "paid": return "Pagada";
            case "pending": return "Pendiente";
            case "cancelled": return "Cancelada";
            default: return status;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Facturas</Text>
                <Text style={styles.subtitle}>Historial de pagos</Text>
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
                ) : bills.length === 0 ? (
                    <EmptyState message="No hay facturas registradas" />
                ) : (
                    bills.map((bill) => (
                        <TouchableOpacity
                            key={bill.id}
                            onPress={() => navigation.navigate("BillDetail", { billId: bill.id, billData: bill })}
                            activeOpacity={0.7}
                        >
                            <Card style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.billInfo}>
                                        <Text style={styles.billNumber}>Factura #{bill.id}</Text>
                                        <Text style={styles.orderText}>Orden #{bill.orderId}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) }]}>
                                        <Text style={styles.statusText}>{getStatusText(bill.status)}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardBody}>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="attach-money" size={18} color={COLORS.secondary} />
                                        <Text style={styles.infoText}>Total: Q{bill.total}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="payment" size={18} color={COLORS.secondary} />
                                        <Text style={styles.infoText}>{bill.paymentMethod || "Efectivo"}</Text>
                                    </View>
                                    {bill.paidAt && (
                                        <View style={styles.infoRow}>
                                            <MaterialIcons name="event" size={18} color={COLORS.secondary} />
                                            <Text style={styles.infoText}>
                                                Pagado: {new Date(bill.paidAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    )}
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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.md,
    },
    billInfo: {
        flex: 1,
    },
    billNumber: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.text,
    },
    orderText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginTop: 2,
        fontWeight: "500",
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statusText: {
        fontSize: FONT_SIZE.xs,
        fontWeight: "700",
        color: COLORS.surface,
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

export default BillsScreen;
