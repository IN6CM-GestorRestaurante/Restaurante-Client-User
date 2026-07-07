// src/features/orders/screens/OrderDetailScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import userClient from "../../../shared/api/userClient";

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
        default: return status || "En cocina";
    }
};

const OrderDetailScreen = ({ route, navigation }) => {
    const { orderId, orderData } = route.params || {};
    const [order, setOrder] = useState(orderData || null);
    const [loading, setLoading] = useState(!orderData);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!orderId) return;
            setLoading(true);
            try {
                const res = await userClient.get(`/orders/${orderId}`);
                if (res.data?.data) {
                    setOrder(res.data.data);
                }
            } catch (err) {
                console.warn("Error fetching order detail:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!order || (!order.items && !order.itemsSnapshot)) {
            fetchDetail();
        }
    }, [orderId]);

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>No se pudo cargar el pedido.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const items = order.items || [];
    const total = order.total || 0;
    const status = order.status || "in-kitchen";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalle de Orden</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <View style={styles.topRow}>
                        <View>
                            <Text style={styles.orderNum}>Orden #{order.id || order._id || orderId}</Text>
                            <Text style={styles.tableText}>Mesa {order.tableNumber || "1"}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: getStatusColor(status) }]}>
                            <Text style={styles.badgeText}>{getStatusText(status).toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.metaSection}>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Fecha:</Text>
                            <Text style={styles.metaVal}>
                                {new Date(order.createdAt || Date.now()).toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Estado del pedido:</Text>
                            <Text style={[styles.metaVal, { color: getStatusColor(status) }]}>
                                {getStatusText(status)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Platillos Solicitados</Text>
                    {items.length === 0 ? (
                        <Text style={styles.noItemsText}>Sin detalle de platillos</Text>
                    ) : (
                        <View style={styles.itemsList}>
                            {items.map((item, idx) => {
                                const name = item.name || item.menuItemName || item.menuItem?.name || "Platillo";
                                const price = item.price || item.priceAtTime || item.menuItem?.price || 0;
                                const qty = item.quantity || 1;
                                const subtotal = price * qty;
                                return (
                                    <View key={idx} style={styles.itemRow}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.itemName}>{name}</Text>
                                            <Text style={styles.itemQty}>{qty}x Q{Number(price).toFixed(2)}</Text>
                                        </View>
                                        <Text style={styles.itemSubtotal}>
                                            Q{Number(subtotal).toFixed(2)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.totalsSection}>
                        <View style={[styles.totalRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={styles.grandTotalVal}>Q{Number(total).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.text,
    },
    backButton: {
        padding: SPACING.xs,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    orderNum: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
    },
    tableText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 12,
    },
    badgeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: FONT_SIZE.xs,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.lg,
    },
    metaSection: {
        gap: SPACING.sm,
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    metaLabel: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
    },
    metaVal: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.text,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    itemsList: {
        gap: SPACING.md,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemName: {
        fontSize: FONT_SIZE.md,
        fontWeight: "600",
        color: COLORS.text,
    },
    itemQty: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
    },
    itemSubtotal: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.text,
    },
    noItemsText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        fontStyle: "italic",
    },
    totalsSection: {
        gap: SPACING.sm,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    grandTotalRow: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.sm,
        marginTop: SPACING.xs,
    },
    grandTotalLabel: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "800",
        color: COLORS.text,
    },
    grandTotalVal: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
    },
    errorText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.error,
        marginBottom: SPACING.md,
    },
    backBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.sm,
        borderRadius: 12,
    },
    backBtnText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default OrderDetailScreen;
