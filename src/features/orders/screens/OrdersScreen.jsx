// src/features/orders/screens/OrdersScreen.jsx
import React, { useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useOrders } from "../hooks/useOrders";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";


// Debe calzar exacto con el enum de status del modelo Order en ServerUser/ServerAdmin
const getStatusColor = (status) => {
    switch (status) {
        case "pending": return COLORS.warning;
        case "in-kitchen": return COLORS.primary;
        case "ready": return COLORS.success;
        case "delivered": return COLORS.success;
        case "paid": return COLORS.info;
        case "cancelled": return COLORS.error;
        default: return COLORS.secondary;
    }
};

const getStatusText = (status) => {
    switch (status) {
        case "pending": return "Pendiente";
        case "in-kitchen": return "En cocina";
        case "ready": return "Lista";
        case "delivered": return "Entregada";
        case "paid": return "Pagada";
        case "cancelled": return "Cancelada";
        default: return status;
    }
};

const OrdersScreen = ({ navigation }) => {
    const { orders, loading, error, refetch, cancelOrder } = useOrders();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    if (loading && orders.length === 0) {
        return <LoadingSpinner />;
    }

    const handleCancel = (order) => {
        Alert.alert("Cancelar pedido", "¿Estás seguro de que quieres cancelar este pedido?", [
            { text: "No", style: "cancel" },
            {
                text: "Sí, cancelar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await cancelOrder(order.id);
                    } catch (err) {
                        Alert.alert("Error", err.response?.data?.message || "No se pudo cancelar el pedido");
                    }
                },
            },
        ]);
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
                            onPress={() => navigation.navigate("OrderDetail", { orderId: order.id, orderData: order })}
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
                                {order.status === "pending" && (
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleCancel(order);
                                        }}
                                    >
                                        <MaterialIcons name="cancel" size={18} color={COLORS.error} />
                                        <Text style={styles.cancelText}>Cancelar Pedido</Text>
                                    </TouchableOpacity>
                                )}
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
    cancelButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
        marginTop: SPACING.md,
        alignSelf: "flex-start",
    },
    cancelText: {
        color: COLORS.error,
        fontWeight: "700",
        fontSize: FONT_SIZE.sm,
    },
});

export default OrdersScreen;
