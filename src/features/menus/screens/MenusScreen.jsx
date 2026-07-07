// src/features/menus/screens/MenusScreen.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMenus } from "../hooks/useMenus";
import { useBranchStore } from "../../branches/store/branchStore";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import { getActivePromotion } from "../../../shared/utils/pricing.js";
import CartModal from "../components/CartModal";

// Debe calzar exacto con el enum de category del modelo Menu en ServerUser/ServerAdmin
const CATEGORIES = ["Todos", "Entrada", "Plato Fuerte", "Acompañamiento", "Bebida", "Postre", "Otro"];

const MenusScreen = ({ navigation }) => {
    const { selectedBranch } = useBranchStore();
    const branchId = selectedBranch?._id || selectedBranch?.id;
    const { menus, loading, error, refetch } = useMenus(branchId);
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [cartVisible, setCartVisible] = useState(false);

    const filteredMenus = selectedCategory === "Todos"
        ? menus
        : menus.filter(item => item.category === selectedCategory);

    const getImageSource = (image) => {
        if (image && image.startsWith("http")) {
            return { uri: image };
        }
        return require("../../../../assets/icon.png");
    };

    if (loading && menus.length === 0) {
        return <LoadingSpinner />;
    }

    if (!selectedBranch) {
        return (
            <View style={styles.container}>
                <EmptyState message="Selecciona un restaurante primero desde la pestaña Restaurantes" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Menú</Text>
                    <Text style={styles.subtitle}>{selectedBranch.name}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => navigation.navigate("Reviews")}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="star-rate" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => setCartVisible(true)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="shopping-cart" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.categoriesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesScroll}
                >
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryPill,
                                selectedCategory === category && styles.categoryPillActive
                            ]}
                            onPress={() => setSelectedCategory(category)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category && styles.categoryTextActive
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
                ) : filteredMenus.length === 0 ? (
                    <EmptyState message="No hay items en el menú" />
                ) : (
                    filteredMenus.map((item) => {
                        const promotion = getActivePromotion(item);
                        return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => navigation.navigate("MenuDetail", { menuId: item.id })}
                            activeOpacity={0.7}
                        >
                            <Card style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Image source={getImageSource(item.image)} style={styles.itemImage} />
                                    <View style={styles.itemInfo}>
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                            {promotion ? (
                                                <View style={styles.priceColumn}>
                                                    <Text style={styles.itemPriceStrike}>Q{promotion.originalPrice}</Text>
                                                    <Text style={styles.itemPricePromo}>Q{promotion.discountedPrice.toFixed(2)}</Text>
                                                </View>
                                            ) : (
                                                <Text style={styles.itemPrice}>Q{item.price}</Text>
                                            )}
                                        </View>
                                        {promotion && (
                                            <View style={styles.promoBadge}>
                                                <MaterialIcons name="local-offer" size={12} color={COLORS.surface} />
                                                <Text style={styles.promoBadgeText}>{promotion.label}</Text>
                                            </View>
                                        )}
                                        <Text style={styles.itemDescription} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                        <View style={styles.cardFooter}>
                                            <View style={styles.categoryBadge}>
                                                <Text style={styles.categoryBadgeText}>{item.category}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.addButton}>
                                                <MaterialIcons name="add" size={20} color={COLORS.surface} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
            
            <CartModal visible={cartVisible} onClose={() => setCartVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    headerActions: {
        flexDirection: "row",
        gap: SPACING.sm,
    },
    cartButton: {
        padding: SPACING.md,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceVariant,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoriesContainer: {
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    categoriesScroll: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    categoryPill: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: 24,
        backgroundColor: COLORS.background,
        marginRight: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    categoryPillActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    categoryTextActive: {
        color: COLORS.surface,
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
    cardContent: {
        flexDirection: "row",
        padding: SPACING.md,
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 16,
        marginRight: SPACING.md,
        backgroundColor: COLORS.surfaceVariant,
    },
    itemInfo: {
        flex: 1,
        justifyContent: "space-between",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.sm,
    },
    itemName: {
        flex: 1,
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.text,
        marginRight: SPACING.sm,
    },
    itemPrice: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "800",
        color: COLORS.primary,
    },
    priceColumn: {
        alignItems: "flex-end",
    },
    itemPriceStrike: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        textDecorationLine: "line-through",
    },
    itemPricePromo: {
        fontSize: FONT_SIZE.lg,
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
        paddingVertical: 2,
        borderRadius: 8,
        marginBottom: SPACING.sm,
    },
    promoBadgeText: {
        color: COLORS.surface,
        fontSize: FONT_SIZE.xs,
        fontWeight: "700",
    },
    itemDescription: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginBottom: SPACING.md,
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    categoryBadge: {
        backgroundColor: COLORS.surfaceVariant,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: 8,
    },
    categoryBadgeText: {
        fontSize: FONT_SIZE.xs,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default MenusScreen;