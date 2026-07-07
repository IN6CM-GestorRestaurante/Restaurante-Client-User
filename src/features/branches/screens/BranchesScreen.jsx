// src/features/branches/screens/BranchesScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useBranchStore } from "../store/branchStore";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import Input from "../../../shared/components/Input";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const BranchesScreen = ({ navigation }) => {
    const { branches, selectedBranch, setSelectedBranch, fetchBranches, loading, error } = useBranchStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const handleSearch = (text) => {
        setSearch(text);
        fetchBranches(text);
    };

    const getImageSource = (photos) => {
        const first = Array.isArray(photos) ? photos[0] : null;
        if (first && first.startsWith("http")) return { uri: first };
        return require("../../../../assets/icon.png");
    };

    if (loading && branches.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Restaurantes</Text>
                <Text style={styles.subtitle}>Elige dónde quieres comer hoy</Text>
                <Input
                    placeholder="Buscar por nombre, categoría o dirección..."
                    value={search}
                    onChangeText={handleSearch}
                    iconName="search"
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchBranches(search)} tintColor={COLORS.primary} />}
            >
                {error ? (
                    <EmptyState message={error} />
                ) : branches.length === 0 ? (
                    <EmptyState message="No se encontraron restaurantes" />
                ) : (
                    branches.map((branch) => {
                        const isSelected = (selectedBranch?._id || selectedBranch?.id) === branch._id;
                        return (
                            <TouchableOpacity
                                key={branch._id}
                                onPress={() => navigation.navigate("BranchDetail", { branchId: branch._id })}
                                activeOpacity={0.7}
                            >
                                <Card style={[styles.card, isSelected && styles.cardSelected]}>
                                    <View style={styles.cardContent}>
                                        <Image source={getImageSource(branch.photos)} style={styles.branchImage} />
                                        <View style={styles.branchInfo}>
                                            <Text style={styles.branchName} numberOfLines={1}>{branch.name}</Text>
                                            <View style={styles.infoRow}>
                                                <MaterialIcons name="restaurant" size={14} color={COLORS.secondary} />
                                                <Text style={styles.infoText}>{branch.category}</Text>
                                            </View>
                                            <View style={styles.infoRow}>
                                                <MaterialIcons name="location-on" size={14} color={COLORS.secondary} />
                                                <Text style={styles.infoText} numberOfLines={1}>{branch.address}</Text>
                                            </View>
                                            <View style={styles.infoRow}>
                                                <MaterialIcons name="schedule" size={14} color={COLORS.secondary} />
                                                <Text style={styles.infoText}>{branch.openingTime} - {branch.closingTime}</Text>
                                            </View>
                                        </View>
                                        {isSelected && (
                                            <MaterialIcons name="check-circle" size={22} color={COLORS.success} />
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.selectButton, isSelected && styles.selectButtonActive]}
                                        onPress={() => setSelectedBranch(branch)}
                                    >
                                        <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextActive]}>
                                            {isSelected ? "Seleccionado" : "Elegir esta sucursal"}
                                        </Text>
                                    </TouchableOpacity>
                                </Card>
                            </TouchableOpacity>
                        );
                    })
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
        marginBottom: SPACING.md,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    card: {
        marginBottom: SPACING.md,
    },
    cardSelected: {
        borderWidth: 2,
        borderColor: COLORS.success,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SPACING.sm,
    },
    branchImage: {
        width: 70,
        height: 70,
        borderRadius: 14,
        marginRight: SPACING.md,
        backgroundColor: COLORS.surfaceVariant,
    },
    branchInfo: {
        flex: 1,
        gap: 2,
    },
    branchName: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 2,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    infoText: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.textLight,
    },
    selectButton: {
        paddingVertical: SPACING.sm,
        borderRadius: 24,
        alignItems: "center",
        backgroundColor: COLORS.surfaceVariant,
    },
    selectButtonActive: {
        backgroundColor: COLORS.success,
    },
    selectButtonText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.primary,
    },
    selectButtonTextActive: {
        color: COLORS.surface,
    },
});

export default BranchesScreen;
