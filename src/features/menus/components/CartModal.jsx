// src/features/menus/components/CartModal.jsx
import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const CartModal = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Carrito</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="shopping-cart" size={64} color={COLORS.secondary} />
                            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                            <Text style={styles.emptySubtext}>Agrega platillos del menú</Text>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalAmount}>Q0.00</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton} disabled>
                            <Text style={styles.checkoutButtonText}>Proceder al pago</Text>
                        </TouchableOpacity>
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
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
        fontSize: FONT_SIZE.huge,
        fontWeight: "bold",
        color: COLORS.text,
    },
    closeButton: {
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
        marginBottom: SPACING.md,
    },
    totalLabel: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "600",
        color: COLORS.text,
    },
    totalAmount: {
        fontSize: FONT_SIZE.huge,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    checkoutButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        borderRadius: 12,
        alignItems: "center",
        opacity: 0.5,
    },
    checkoutButtonText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.surface,
    },
});

export default CartModal;
