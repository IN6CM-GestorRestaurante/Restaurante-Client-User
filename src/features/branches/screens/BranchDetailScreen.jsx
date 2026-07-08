// src/features/branches/screens/BranchDetailScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import userClient from "../../../shared/api/userClient.js";
import { useBranchStore } from "../store/branchStore";
import { useMenus } from "../../menus/hooks/useMenus";
import { useCartStore } from "../../menus/store/cartStore";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import { getActivePromotion } from "../../../shared/utils/pricing.js";
import CartModal from "../../menus/components/CartModal";

const CATEGORIES = ["Todos", "Entrada", "Plato Fuerte", "Acompañamiento", "Bebida", "Postre", "Otro"];

const BranchDetailScreen = ({ route, navigation }) => {
    const { branchId } = route.params || {};
    const [branch, setBranch] = useState(null);
    const [loadingBranch, setLoadingBranch] = useState(true);

    const { menus, loading: loadingMenus, error, refetch } = useMenus(branchId);
    const { addItem, getItemCount } = useCartStore();
    const itemCount = getItemCount();
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [cartVisible, setCartVisible] = useState(false);

    useEffect(() => {
        let mounted = true;
        userClient
            .get(`/branches/${branchId}`)
            .then((res) => {
                if (mounted) setBranch(res.data?.data || null);
            })
            .catch((err) => {
                console.warn("Error fetching branch detail:", err);
                Alert.alert("Error", "No se pudo cargar la información de la sucursal");
            })
            .finally(() => mounted && setLoadingBranch(false));
        return () => {
            mounted = false;
        };
    }, [branchId]);

    const filteredMenus = selectedCategory === "Todos"
        ? menus
        : menus.filter(item => item.category === selectedCategory);

    const getImageSource = (image) => {
        if (image && image.startsWith("http")) {
            return { uri: image };
        }
        return require("../../../../assets/icon.png");
    };

    if (loadingBranch && !branch) return <LoadingSpinner />;
    if (!branch) return null;

    const photo = Array.isArray(branch.photos) && branch.photos[0]?.startsWith("http") ? branch.photos[0] : null;
    const isRefreshing = loadingMenus || loadingBranch;

    const onRefresh = () => {
        refetch();
        setLoadingBranch(true);
        userClient
            .get(`/branches/${branchId}`)
            .then((res) => {
                setBranch(res.data?.data || null);
            })
            .finally(() => setLoadingBranch(false));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>{branch.name}</Text>
                    <Text style={styles.headerSubtitle}>{branch.category}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: SPACING.sm }}>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => navigation.navigate("Mesas")}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="table-restaurant" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.cartButton, { position: "relative" }]}
                        onPress={() => setCartVisible(true)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="shopping-cart" size={24} color={COLORS.primary} />
                        {itemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{itemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                style={styles.content}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
            >
                <Image
                    source={photo ? { uri: photo } : require("../../../../assets/icon.png")}
                    style={styles.image}
                />

                <View style={styles.branchHeaderInfo}>
                    <Text style={styles.name}>{branch.name}</Text>
                    <View style={styles.ratingRow}>
                        <View style={styles.starsContainer}>
                            <Text style={styles.ratingValue}>{branch.rating > 0 ? branch.rating.toFixed(1) : "Nuevo"}</Text>
                            <MaterialIcons name="star" size={18} color={COLORS.primary} />
                            <Text style={styles.reviewCountText}>({branch.reviewCount || 0} reseñas)</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("Reviews", { branchId })}>
                            <Text style={styles.viewReviewsText}>Ver reseñas {">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.description}>{branch.description}</Text>
                </View>

                <Card style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="location-on" size={20} color={COLORS.secondary} />
                        <Text style={styles.infoText}>{branch.address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="schedule" size={20} color={COLORS.secondary} />
                        <Text style={styles.infoText}>{branch.openingTime} - {branch.closingTime}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="attach-money" size={20} color={COLORS.secondary} />
                        <Text style={styles.infoText}>Precio promedio: Q{branch.averagePrice}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="phone" size={20} color={COLORS.secondary} />
                        <Text style={styles.infoText}>{branch.phoneNumber}</Text>
                    </View>
                </Card>

                <View style={styles.menuSectionHeader}>
                    <Text style={styles.menuSectionTitle}>Menú</Text>
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

                <View style={styles.menuListContainer}>
                    {error ? (
                        <EmptyState message={error} />
                    ) : filteredMenus.length === 0 && !loadingMenus ? (
                        <EmptyState message="No hay items en esta categoría" />
                    ) : (
                        filteredMenus.map((item) => {
                            const promotion = getActivePromotion(item);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => navigation.navigate("MenuDetail", { menuId: item.id })}
                                    activeOpacity={0.7}
                                >
                                    <Card style={styles.menuCard}>
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
                                                    <TouchableOpacity
                                                        style={styles.addButton}
                                                        onPress={() => {
                                                            const promo = getActivePromotion(item);
                                                            const priceToUse = promo ? promo.discountedPrice : item.price;
                                                            addItem({ ...item, price: priceToUse }, branchId);
                                                            Alert.alert("Agregado al carrito", `${item.name} ha sido agregado a tu orden.`);
                                                        }}
                                                    >
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
                </View>
            </ScrollView>

            <CartModal visible={cartVisible} onClose={() => setCartVisible(false)} navigation={navigation} />
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
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "800",
        color: COLORS.primary,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        fontWeight: "500",
    },
    cartButton: {
        padding: SPACING.sm,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceVariant,
    },
    badge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: COLORS.error,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    badgeText: {
        color: COLORS.surface,
        fontSize: 10,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
    },
    image: {
        width: "100%",
        height: 200,
        backgroundColor: COLORS.surfaceVariant,
    },
    branchHeaderInfo: {
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    name: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "900",
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    ratingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.md,
    },
    starsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingValue: {
        fontSize: FONT_SIZE.md,
        fontWeight: "bold",
        color: COLORS.text,
    },
    reviewCountText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginLeft: 4,
    },
    viewReviewsText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.primary,
    },
    description: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        lineHeight: 22,
    },
    infoCard: {
        margin: SPACING.lg,
        gap: SPACING.sm,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
    },
    infoText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        fontWeight: "500",
        flex: 1,
    },
    menuSectionHeader: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    menuSectionTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    categoriesContainer: {
        paddingVertical: SPACING.sm,
    },
    categoriesScroll: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    categoryPill: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: 24,
        backgroundColor: COLORS.surface,
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
    menuListContainer: {
        padding: SPACING.lg,
        paddingTop: SPACING.sm,
    },
    menuCard: {
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
        alignItems: "flex-start",
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

export default BranchDetailScreen;
