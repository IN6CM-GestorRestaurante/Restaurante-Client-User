// src/features/menus/screens/MenuDetailScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import userClient from "../../../shared/api/userClient.js";
import { useCartStore } from "../store/cartStore";
import { useBranchStore } from "../../branches/store/branchStore";
import { Card, LoadingSpinner } from "../../../shared/components/Common";
import Button from "../../../shared/components/Button";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import { getActivePromotion } from "../../../shared/utils/pricing.js";

const MenuDetailScreen = ({ route, navigation }) => {
    const { menuId } = route.params || {};
    const { addItem } = useCartStore();
    const { selectedBranch } = useBranchStore();
    const branchId = selectedBranch?._id || selectedBranch?.id;

    const [menuItem, setMenuItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        let mounted = true;
        userClient
            .get(`/menus/${menuId}`)
            .then((res) => {
                if (mounted) setMenuItem(res.data?.data || null);
            })
            .catch((err) => {
                console.warn("Error fetching menu detail:", err);
                Alert.alert("Error", "No se pudo cargar la información del platillo");
            })
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, [menuId]);

    if (loading) return <LoadingSpinner />;
    if (!menuItem) return null;

    const photo = menuItem.image && menuItem.image.startsWith("http") ? menuItem.image : null;
    const promotion = getActivePromotion(menuItem);
    const priceToUse = promotion ? promotion.discountedPrice : menuItem.price;

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({ ...menuItem, price: priceToUse }, branchId);
        }
        Alert.alert("Agregado al carrito", `Se agregaron ${quantity} x ${menuItem.name} a tu orden.`);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Image
                    source={photo ? { uri: photo } : require("../../../../assets/icon.png")}
                    style={styles.image}
                />

                <View style={styles.headerRow}>
                    <Text style={styles.name}>{menuItem.name}</Text>
                    {promotion ? (
                        <View style={styles.priceColumn}>
                            <Text style={styles.itemPriceStrike}>Q{promotion.originalPrice}</Text>
                            <Text style={styles.itemPricePromo}>Q{promotion.discountedPrice.toFixed(2)}</Text>
                        </View>
                    ) : (
                        <Text style={styles.itemPrice}>Q{menuItem.price}</Text>
                    )}
                </View>

                {promotion && (
                    <View style={styles.promoBadge}>
                        <MaterialIcons name="local-offer" size={14} color={COLORS.surface} />
                        <Text style={styles.promoBadgeText}>{promotion.label}</Text>
                    </View>
                )}

                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{menuItem.category}</Text>
                </View>

                <Text style={styles.description}>{menuItem.description}</Text>

                {menuItem.ingredients && menuItem.ingredients.length > 0 && (
                    <Card style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>Ingredientes Principales</Text>
                        {menuItem.ingredients.map((ing, idx) => (
                            <View key={idx} style={styles.infoRow}>
                                <MaterialIcons name="check-circle" size={18} color={COLORS.primary} />
                                <Text style={styles.infoText}>{ing.name || ing}</Text>
                            </View>
                        ))}
                    </Card>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        style={styles.quantityBtn} 
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <MaterialIcons name="remove" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity 
                        style={styles.quantityBtn} 
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <MaterialIcons name="add" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
                
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Button
                        title={`Agregar (Q${(priceToUse * quantity).toFixed(2)})`}
                        onPress={handleAddToCart}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 100, // Space for footer
    },
    image: {
        width: "100%",
        height: 220,
        borderRadius: 16,
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.surfaceVariant,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: SPACING.xs,
    },
    name: {
        flex: 1,
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
        marginRight: SPACING.md,
    },
    priceColumn: {
        alignItems: "flex-end",
    },
    itemPrice: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
    },
    itemPriceStrike: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        textDecorationLine: "line-through",
    },
    itemPricePromo: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.error,
    },
    promoBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        alignSelf: "flex-start",
        backgroundColor: COLORS.error,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: SPACING.md,
    },
    promoBadgeText: {
        color: COLORS.surface,
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
    },
    categoryBadge: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.surfaceVariant,
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: SPACING.lg,
    },
    categoryBadgeText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.text,
    },
    description: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    infoCard: {
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    infoText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        flex: 1,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.surface,
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: "row",
        alignItems: "center",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderRadius: 24,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    quantityBtn: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
        backgroundColor: COLORS.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    quantityText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.primary,
        marginHorizontal: SPACING.md,
        minWidth: 20,
        textAlign: "center",
    },
});

export default MenuDetailScreen;
