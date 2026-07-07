// src/features/branches/screens/BranchDetailScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import userClient from "../../../shared/api/userClient.js";
import { useBranchStore } from "../store/branchStore";
import { Card, LoadingSpinner } from "../../../shared/components/Common";
import Button from "../../../shared/components/Button";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const BranchDetailScreen = ({ route, navigation }) => {
    const { branchId } = route.params || {};
    const { selectedBranch, setSelectedBranch } = useBranchStore();
    const [branch, setBranch] = useState(null);
    const [loading, setLoading] = useState(true);

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
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, [branchId]);

    if (loading) return <LoadingSpinner />;
    if (!branch) return null;

    const isSelected = (selectedBranch?._id || selectedBranch?.id) === branch._id;
    const photo = Array.isArray(branch.photos) && branch.photos[0]?.startsWith("http") ? branch.photos[0] : null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Image
                source={photo ? { uri: photo } : require("../../../../assets/icon.png")}
                style={styles.image}
            />

            <Text style={styles.name}>{branch.name}</Text>
            <Text style={styles.description}>{branch.description}</Text>

            <Card style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="restaurant" size={20} color={COLORS.secondary} />
                    <Text style={styles.infoText}>{branch.category}</Text>
                </View>
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

            <Button
                title={isSelected ? "Sucursal Seleccionada" : "Elegir esta sucursal"}
                onPress={() => {
                    setSelectedBranch(branch);
                    navigation.navigate("MenusList");
                }}
                variant={isSelected ? "secondary" : "primary"}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 16,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.surfaceVariant,
    },
    name: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    description: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    infoCard: {
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
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
});

export default BranchDetailScreen;
