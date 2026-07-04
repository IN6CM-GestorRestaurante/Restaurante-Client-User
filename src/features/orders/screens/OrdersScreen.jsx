// src/features/orders/screens/OrdersScreen.jsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useOrders } from "../hooks/useOrders";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const OrdersScreen = ({ navigation }) => {
    const { orders, loading, error, refetch } = useOrders();

    if (loading && orders.length === 0) {
        return <LoadingSpinner />;
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return COLORS.warning;
            case "preparing": return COLORS.primary;
            case "ready": return COLORS.success;
            case "delivered": return COLORS.success;
            case "cancelled": return COLORS.error;
            default: return COLORS.secondary;
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "Pendiente";
            case "preparing": return "Preparando";
            case "ready": return "Lista";
            case "delivered": return "Entregada";
            case "cancelled": return "Cancelada";
            default: return status;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Órdenes</Text>
                <Text style={styles.subtitle}>Historial de tus órdenes</Text>
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
                ) : orders.length === 0 ? (
                    <EmptyState message="No hay órdenes registradas" />
                ) : (
                    orders.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            onPress={() => navigation.navigate("OrderDetail", { orderId: order.id })}
                            activeOpacity={0.7}
                        >
                            <Card style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.orderInfo}>
                                        <Text style={styles.orderNumber}>Orden #{order.id}</Text>
                                        <Text style={styles.tableText}>Mesa {order.tableNumber}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                                        <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardBody}>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="attach-money" size={18} color={COLORS.secondary} />
                                        <Text style={styles.infoText}>Total: Q{order.total}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <MaterialIcons name="schedule" size={18} color={COLORS.secondary} />
                                        <Text style={styles.infoText}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </Text>
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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.md,
    },
    orderInfo: {
        flex: 1,
    },
    orderNumber: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.text,
    },
    tableText: {
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

export default OrdersScreen;
