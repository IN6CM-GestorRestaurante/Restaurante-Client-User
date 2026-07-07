// src/features/bills/screens/BillDetailScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import userClient from "../../../shared/api/userClient";

const BillDetailScreen = ({ route, navigation }) => {
    const { billId, billData } = route.params || {};
    const [bill, setBill] = useState(billData || null);
    const [loading, setLoading] = useState(!billData);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!billId) return;
            setLoading(true);
            try {
                const res = await userClient.get(`/bills/${billId}`);
                if (res.data?.data) {
                    setBill(res.data.data);
                }
            } catch (err) {
                console.warn("Error fetching bill detail:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!bill || !bill.itemsSnapshot) {
            fetchDetail();
        }
    }, [billId]);

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!bill) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>No se pudo cargar la factura.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const total = bill.total || bill.totalAmount || 0;
    const subtotal = bill.subtotal || total / 1.12;
    const tax = bill.taxAmount || (total - subtotal);
    const items = bill.itemsSnapshot || [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalle de Factura</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <View style={styles.topRow}>
                        <View>
                            <Text style={styles.invoiceNum}>
                                Factura #{bill.invoiceNumber || bill.id || billId}
                            </Text>
                            <Text style={styles.orderNum}>Orden #{bill.orderId || "N/A"}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>PAGADA</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.metaSection}>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Fecha de emisión:</Text>
                            <Text style={styles.metaVal}>
                                {new Date(bill.paidAt || bill.committedAt || bill.createdAt || Date.now()).toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Método de pago:</Text>
                            <Text style={styles.metaVal}>
                                {bill.paymentMethod === "CARD" || bill.paymentMethod === "Tarjeta" ? "Tarjeta de Crédito/Débito" : "Efectivo / Otro"}
                            </Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Emitido por:</Text>
                            <Text style={styles.metaVal}>{bill.billedBy || "App Móvil (Autoservicio)"}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Platillos Facturados</Text>
                    {items.length === 0 ? (
                        <Text style={styles.noItemsText}>Consumo en restaurante / pedido en mesa</Text>
                    ) : (
                        <View style={styles.itemsList}>
                            {items.map((item, idx) => (
                                <View key={idx} style={styles.itemRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemName}>{item.menuItemName || item.name}</Text>
                                        <Text style={styles.itemQty}>{item.quantity}x Q{(item.priceAtTime || 0).toFixed(2)}</Text>
                                    </View>
                                    <Text style={styles.itemSubtotal}>
                                        Q{(item.subtotal || (item.quantity * item.priceAtTime) || 0).toFixed(2)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.totalsSection}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalVal}>Q{Number(subtotal).toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>IVA (12%)</Text>
                            <Text style={styles.totalVal}>Q{Number(tax).toFixed(2)}</Text>
                        </View>
                        <View style={[styles.totalRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalLabel}>Total Pagado</Text>
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
    invoiceNum: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
    },
    orderNum: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginTop: 2,
    },
    badge: {
        backgroundColor: COLORS.success || "#2e7d32",
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
    totalLabel: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
    },
    totalVal: {
        fontSize: FONT_SIZE.md,
        fontWeight: "600",
        color: COLORS.text,
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

export default BillDetailScreen;
