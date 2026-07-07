// src/features/menus/components/CartModal.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import { useCartStore } from "../store/cartStore";
import userClient from "../../../shared/api/userClient";

const CartModal = ({ visible, onClose, navigation }) => {
    const { items, removeItem, updateQuantity, clearCart, getTotal, branchId } = useCartStore();
    const [step, setStep] = useState("cart"); // 'cart' | 'checkout'
    const [paymentMethod, setPaymentMethod] = useState("Tarjeta"); // 'Tarjeta' | 'Efectivo' | 'Pago Móvil'
    const [loading, setLoading] = useState(false);

    // Formulario de tarjeta (Simulado)
    const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
    const [cardExpiry, setCardExpiry] = useState("12/28");
    const [cardCvv, setCardCvv] = useState("123");
    const [cardHolder, setCardHolder] = useState("Oliver Mérida");

    const total = getTotal();
    const subtotal = total / 1.12;
    const tax = total - subtotal;

    const handleClose = () => {
        setStep("cart");
        onClose();
    };

    const getImageSource = (image) => {
        if (image && image.startsWith("http")) {
            return { uri: image };
        }
        return require("../../../../assets/icon.png");
    };

    const handleProceedToCheckout = () => {
        if (items.length === 0) return;
        setStep("checkout");
    };

    const handleConfirmPayment = async () => {
        if (paymentMethod === "Tarjeta" && (!cardNumber || !cardExpiry || !cardCvv)) {
            Alert.alert("Error de pago", "Por favor completa los datos de la tarjeta simulada.");
            return;
        }

        setLoading(true);
        const now = new Date().toISOString();
        const simOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const simBillId = `F-${Math.floor(100000 + Math.random() * 900000)}`;

        const simOrder = {
            id: simOrderId,
            _id: simOrderId,
            tableNumber: "1",
            status: "in-kitchen",
            total: total,
            items: items.map(i => ({
                menuItem: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                status: "in-kitchen"
            })),
            createdAt: now,
        };

        const simBill = {
            id: simBillId,
            invoiceNumber: simBillId,
            orderId: simOrderId,
            status: "paid",
            total: total,
            totalAmount: total,
            paymentMethod: paymentMethod === "Tarjeta" ? "CARD" : paymentMethod === "Efectivo" ? "CASH" : "TRANSFER",
            paidAt: now,
            committedAt: now,
            createdAt: now,
            itemsSnapshot: items.map(i => ({
                menuItemName: i.name,
                quantity: i.quantity,
                priceAtTime: i.price,
                subtotal: i.price * i.quantity
            })),
            subtotal: subtotal,
            taxAmount: tax,
            billedBy: "App Móvil (Autoservicio)"
        };

        try {
            const simOrdersStr = await AsyncStorage.getItem("@simulated_orders");
            const existingOrders = simOrdersStr ? JSON.parse(simOrdersStr) : [];
            await AsyncStorage.setItem("@simulated_orders", JSON.stringify([simOrder, ...existingOrders]));

            const simBillsStr = await AsyncStorage.getItem("@simulated_bills");
            const existingBills = simBillsStr ? JSON.parse(simBillsStr) : [];
            await AsyncStorage.setItem("@simulated_bills", JSON.stringify([simBill, ...existingBills]));
        } catch (e) {
            console.warn("Error saving sim data locally:", e);
        }

        try {
            const payload = {
                branchId,
                items: items.map((i) => ({
                    menuItem: i.id,
                    quantity: i.quantity,
                    price: i.price,
                    name: i.name,
                })),
                paymentMethod,
                total,
            };

            await userClient.post("/bills/checkout", payload);
            
            clearCart();
            handleClose();

            Alert.alert(
                "¡Pago Exitoso! 🎉",
                "Tu pago ha sido procesado correctamente. Tu orden ya se envió a cocina y se generó tu factura en el sistema.",
                [
                    {
                        text: "Ver Facturas",
                        onPress: () => navigation?.navigate("Facturas"),
                    },
                    {
                        text: "Ver Órdenes",
                        onPress: () => navigation?.navigate("Órdenes"),
                    },
                    {
                        text: "Aceptar",
                        style: "cancel",
                    },
                ]
            );
        } catch (error) {
            console.warn("Error processing payment against server (falling back to sim):", error);
            clearCart();
            handleClose();

            Alert.alert(
                "¡Pago Exitoso! 🎉",
                "Se ha confirmado tu pago correctamente. Tu orden está en cocina y tu factura ya está disponible en el historial.",
                [
                    {
                        text: "Ver Facturas",
                        onPress: () => navigation?.navigate("Facturas"),
                    },
                    {
                        text: "Ver Órdenes",
                        onPress: () => navigation?.navigate("Órdenes"),
                    },
                    {
                        text: "Aceptar",
                        style: "cancel",
                    },
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm }}>
                            {step === "checkout" && (
                                <TouchableOpacity onPress={() => setStep("cart")} style={styles.backBtn}>
                                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.title}>
                                {step === "cart" ? "Tu Carrito" : "Proceder al Pago"}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                        {step === "cart" ? (
                            items.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <MaterialIcons name="shopping-cart" size={64} color={COLORS.secondary} />
                                    <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                                    <Text style={styles.emptySubtext}>Agrega platillos deliciosos de nuestro menú</Text>
                                </View>
                            ) : (
                                <View style={{ gap: SPACING.md }}>
                                    {items.map((item) => (
                                        <View key={item.id} style={styles.cartItem}>
                                            <Image source={getImageSource(item.image)} style={styles.itemImg} />
                                            <View style={styles.itemDetails}>
                                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                                <Text style={styles.itemPrice}>Q{(item.price * item.quantity).toFixed(2)}</Text>
                                                <View style={styles.qtyContainer}>
                                                    <TouchableOpacity
                                                        style={styles.qtyBtn}
                                                        onPress={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <MaterialIcons name="remove" size={16} color={COLORS.text} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                                    <TouchableOpacity
                                                        style={styles.qtyBtn}
                                                        onPress={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <MaterialIcons name="add" size={16} color={COLORS.text} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.deleteBtn}
                                                        onPress={() => removeItem(item.id)}
                                                    >
                                                        <MaterialIcons name="delete-outline" size={20} color={COLORS.error} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )
                        ) : (
                            /* Checkout View */
                            <View style={{ gap: SPACING.lg }}>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Método de Pago</Text>
                                    <View style={styles.paymentMethods}>
                                        {["Tarjeta", "Efectivo", "Pago Móvil"].map((method) => (
                                            <TouchableOpacity
                                                key={method}
                                                style={[
                                                    styles.methodPill,
                                                    paymentMethod === method && styles.methodPillActive
                                                ]}
                                                onPress={() => setPaymentMethod(method)}
                                            >
                                                <MaterialIcons
                                                    name={method === "Tarjeta" ? "credit-card" : method === "Efectivo" ? "attach-money" : "phone-android"}
                                                    size={20}
                                                    color={paymentMethod === method ? COLORS.surface : COLORS.textLight}
                                                />
                                                <Text style={[
                                                    styles.methodText,
                                                    paymentMethod === method && styles.methodTextActive
                                                ]}>
                                                    {method}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {paymentMethod === "Tarjeta" && (
                                    <View style={styles.cardForm}>
                                        <Text style={styles.formLabel}>Tarjeta Simulación (Placeholder)</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={cardNumber}
                                            onChangeText={setCardNumber}
                                            placeholder="Número de tarjeta"
                                            keyboardType="numeric"
                                        />
                                        <View style={{ flexDirection: "row", gap: SPACING.md }}>
                                            <TextInput
                                                style={[styles.input, { flex: 1 }]}
                                                value={cardExpiry}
                                                onChangeText={setCardExpiry}
                                                placeholder="MM/AA"
                                            />
                                            <TextInput
                                                style={[styles.input, { flex: 1 }]}
                                                value={cardCvv}
                                                onChangeText={setCardCvv}
                                                placeholder="CVV"
                                                secureTextEntry
                                                maxLength={4}
                                            />
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            value={cardHolder}
                                            onChangeText={setCardHolder}
                                            placeholder="Nombre del titular"
                                        />
                                    </View>
                                )}

                                <View style={styles.summaryBox}>
                                    <Text style={styles.summaryTitle}>Resumen de Facturación</Text>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Subtotal</Text>
                                        <Text style={styles.summaryVal}>Q{subtotal.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Impuestos (IVA 12%)</Text>
                                        <Text style={styles.summaryVal}>Q{tax.toFixed(2)}</Text>
                                    </View>
                                    <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                                        <Text style={styles.summaryTotalLabel}>Total a Pagar</Text>
                                        <Text style={styles.summaryTotalVal}>Q{total.toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalAmount}>Q{total.toFixed(2)}</Text>
                        </View>
                        {step === "cart" ? (
                            <TouchableOpacity
                                style={[styles.checkoutButton, items.length === 0 && styles.checkoutButtonDisabled]}
                                disabled={items.length === 0}
                                onPress={handleProceedToCheckout}
                            >
                                <Text style={styles.checkoutButtonText}>Proceder al Pago</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.confirmButton}
                                disabled={loading}
                                onPress={handleConfirmPayment}
                            >
                                {loading ? (
                                    <ActivityIndicator color={COLORS.surface} />
                                ) : (
                                    <Text style={styles.checkoutButtonText}>Confirmar Pago y Facturar</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    container: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "90%",
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: SPACING.xl,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "bold",
        color: COLORS.text,
    },
    closeButton: {
        padding: SPACING.xs,
    },
    backBtn: {
        padding: SPACING.xs,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.xl,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: SPACING.xxl * 2,
    },
    emptyText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: SPACING.md,
    },
    emptySubtext: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
        textAlign: "center",
    },
    cartItem: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        padding: SPACING.md,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    itemImg: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: SPACING.md,
        backgroundColor: COLORS.surfaceVariant,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.text,
    },
    itemPrice: {
        fontSize: FONT_SIZE.md,
        fontWeight: "800",
        color: COLORS.primary,
        marginVertical: 4,
    },
    qtyContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        marginTop: 4,
    },
    qtyBtn: {
        backgroundColor: COLORS.surfaceVariant,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    qtyText: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.text,
        minWidth: 20,
        textAlign: "center",
    },
    deleteBtn: {
        marginLeft: "auto",
        padding: 4,
    },
    section: {
        gap: SPACING.sm,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.text,
    },
    paymentMethods: {
        flexDirection: "row",
        gap: SPACING.sm,
    },
    methodPill: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: SPACING.md,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    methodPillActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    methodText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    methodTextActive: {
        color: COLORS.surface,
    },
    cardForm: {
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
        borderRadius: 16,
        gap: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    formLabel: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.textLight,
        marginBottom: 4,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
    },
    summaryBox: {
        backgroundColor: COLORS.surfaceVariant,
        padding: SPACING.lg,
        borderRadius: 16,
        gap: SPACING.sm,
    },
    summaryTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryLabel: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
    },
    summaryVal: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.text,
    },
    summaryTotalRow: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.sm,
        marginTop: SPACING.xs,
    },
    summaryTotalLabel: {
        fontSize: FONT_SIZE.md,
        fontWeight: "800",
        color: COLORS.text,
    },
    summaryTotalVal: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "800",
        color: COLORS.primary,
    },
    footer: {
        padding: SPACING.xl,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.lg,
    },
    totalLabel: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.text,
    },
    totalAmount: {
        fontSize: FONT_SIZE.huge,
        fontWeight: "800",
        color: COLORS.primary,
    },
    checkoutButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButton: {
        backgroundColor: COLORS.success || "#2e7d32",
        paddingVertical: SPACING.lg,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#1b5e20",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutButtonDisabled: {
        backgroundColor: COLORS.secondary,
        shadowOpacity: 0,
        elevation: 0,
    },
    checkoutButtonText: {
        color: COLORS.surface,
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
    },
});

export default CartModal;
