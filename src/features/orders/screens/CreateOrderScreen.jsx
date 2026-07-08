import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCartStore } from "../../menus/store/cartStore";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import userClient from "../../../shared/api/userClient";
import { Card } from "../../../shared/components/Common";

const PAYMENT_METHODS = ["Tarjeta", "Efectivo", "Transferencia"];

const CreateOrderScreen = ({ navigation }) => {
    const { items, branchId, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
    const [selectedPayment, setSelectedPayment] = useState("Tarjeta");
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!branchId || items.length === 0) {
            Alert.alert("Error", "Tu carrito está vacío.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                branchId: branchId,
                paymentMethod: selectedPayment,
                total: getTotal(),
                items: items.map(item => ({
                    menuItem: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            // Call checkout API
            const response = await userClient.post("/bills/checkout", payload);
            
            if (response.data.success) {
                clearCart();
                Alert.alert("¡Éxito!", "Tu pedido y pago se han procesado correctamente.", [
                    { text: "Ver mis órdenes", onPress: () => navigation.navigate("OrdersList") }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", error.response?.data?.message || "Hubo un problema al procesar tu pago. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="remove-shopping-cart" size={64} color={COLORS.border} />
                <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
                <Text style={styles.emptySubtitle}>Agrega platillos desde el menú de un restaurante para comenzar.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Restaurantes")}>
                    <Text style={styles.backButtonText}>Explorar Restaurantes</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Checkout</Text>
                <Text style={styles.subtitle}>Revisa tu orden y paga</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* Order Summary */}
                <Text style={styles.sectionTitle}>Resumen del pedido</Text>
                {items.map((item) => (
                    <Card key={item.id} style={styles.itemCard}>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.itemPrice}>Q{(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                        
                        <View style={styles.itemActions}>
                            <View style={styles.quantityControl}>
                                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyButton}>
                                    <MaterialIcons name="remove" size={18} color={COLORS.primary} />
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyButton}>
                                    <MaterialIcons name="add" size={18} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                                <MaterialIcons name="delete-outline" size={20} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}

                {/* Payment Method */}
                <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Método de Pago</Text>
                <View style={styles.paymentContainer}>
                    {PAYMENT_METHODS.map((method) => (
                        <TouchableOpacity
                            key={method}
                            style={[
                                styles.paymentOption,
                                selectedPayment === method && styles.paymentOptionSelected
                            ]}
                            onPress={() => setSelectedPayment(method)}
                        >
                            <MaterialIcons 
                                name={method === "Tarjeta" ? "credit-card" : method === "Efectivo" ? "payments" : "account-balance"} 
                                size={24} 
                                color={selectedPayment === method ? COLORS.primary : COLORS.secondary} 
                            />
                            <Text style={[
                                styles.paymentText,
                                selectedPayment === method && styles.paymentTextSelected
                            ]}>
                                {method}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Footer / Checkout Button */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total a pagar:</Text>
                    <Text style={styles.totalValue}>Q{getTotal().toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]} 
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.surface} size="small" />
                    ) : (
                        <Text style={styles.checkoutText}>Confirmar y Pagar</Text>
                    )}
                </TouchableOpacity>
            </View>
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
        paddingBottom: SPACING.xxl,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    itemCard: {
        flexDirection: "column",
        marginBottom: SPACING.sm,
        padding: SPACING.md,
    },
    itemInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.sm,
    },
    itemName: {
        fontSize: FONT_SIZE.md,
        fontWeight: "600",
        color: COLORS.text,
        flex: 1,
        marginRight: SPACING.sm,
    },
    itemPrice: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.primary,
    },
    itemActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: SPACING.xs,
    },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 20,
        padding: 4,
    },
    qtyButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    qtyText: {
        fontSize: FONT_SIZE.md,
        fontWeight: "600",
        marginHorizontal: SPACING.md,
    },
    removeButton: {
        padding: SPACING.xs,
    },
    paymentContainer: {
        flexDirection: "column",
        gap: SPACING.sm,
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: SPACING.md,
    },
    paymentOptionSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + "10",
    },
    paymentText: {
        fontSize: FONT_SIZE.md,
        fontWeight: "500",
        color: COLORS.secondary,
    },
    paymentTextSelected: {
        color: COLORS.primary,
        fontWeight: "700",
    },
    footer: {
        backgroundColor: COLORS.surface,
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.md,
    },
    totalLabel: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    totalValue: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
    },
    checkoutButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: SPACING.md,
        alignItems: "center",
    },
    checkoutButtonDisabled: {
        backgroundColor: COLORS.secondary,
    },
    checkoutText: {
        color: COLORS.surface,
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.xl,
    },
    emptyTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "700",
        color: COLORS.text,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    emptySubtitle: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        textAlign: "center",
        marginBottom: SPACING.xl,
    },
    backButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: 8,
    },
    backButtonText: {
        color: COLORS.surface,
        fontWeight: "700",
        fontSize: FONT_SIZE.md,
    }
});

export default CreateOrderScreen;
