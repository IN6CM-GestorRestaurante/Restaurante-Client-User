// src/features/profile/screens/ProfileScreen.jsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { useProfile } from "../hooks/useProfile";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import SecuritySection from "../components/SecuritySection";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const ProfileScreen = () => {
    const { profile, loading, error, refetch, updateProfile, logout } = useProfile();
    const [isEditing, setIsEditing] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            displayName: "",
            phone: "",
            favoriteFoods: ""
        }
    });

    useEffect(() => {
        if (profile) {
            reset({
                displayName: profile.displayName || profile.name || "",
                phone: profile.phone || "",
                favoriteFoods: Array.isArray(profile.favoriteFoods) 
                    ? profile.favoriteFoods.join(", ") 
                    : (profile.favoriteFoods || "")
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data) => {
        try {
            const profileData = {
                ...data,
                favoriteFoods: data.favoriteFoods.split(",").map(s => s.trim()).filter(s => s)
            };
            await updateProfile(profileData);
            setIsEditing(false);
            Alert.alert("Éxito", "Perfil actualizado correctamente");
        } catch (err) {
            Alert.alert("Error", err.message || "Error al actualizar perfil");
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Cerrar Sesión", style: "destructive", onPress: async () => {
                    await logout();
                }}
            ]
        );
    };

    const getAvatarSource = () => {
        if (profile?.avatar && profile.avatar.startsWith("http")) {
            return { uri: profile.avatar };
        }
        return require("../../../../assets/icon.png");
    };

    if (loading && !profile) {
        return <LoadingSpinner />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image source={getAvatarSource()} style={styles.avatar} />
                </View>
                <Text style={styles.name}>
                    {profile?.displayName || profile?.name || profile?.username || "Usuario"}
                </Text>
                <Text style={styles.email}>{profile?.email || ""}</Text>
                <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => setIsEditing(!isEditing)}
                >
                    <MaterialIcons 
                        name={isEditing ? "close" : "edit"} 
                        size={20} 
                        color={COLORS.primary} 
                    />
                    <Text style={styles.editButtonText}>
                        {isEditing ? "Cancelar" : "Editar"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    
                    {isEditing ? (
                        <>
                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Nombre de visualización"
                                        placeholder="Tu nombre"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.displayName?.message}
                                    />
                                )}
                                name="displayName"
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Teléfono"
                                        placeholder="+502 1234 5678"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.phone?.message}
                                        keyboardType="phone-pad"
                                    />
                                )}
                                name="phone"
                            />

                            <Controller
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Comidas favoritas"
                                        placeholder="pizza, pasta, sushi"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.favoriteFoods?.message}
                                    />
                                )}
                                name="favoriteFoods"
                            />

                            <Button
                                title="Guardar Cambios"
                                onPress={handleSubmit(onSubmit)}
                                loading={loading}
                            />
                        </>
                    ) : (
                        <>
                            <View style={styles.infoRow}>
                                <MaterialIcons name="person" size={20} color={COLORS.secondary} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Nombre</Text>
                                    <Text style={styles.infoValue}>{profile?.displayName || profile?.name || "-"}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <MaterialIcons name="phone" size={20} color={COLORS.secondary} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Teléfono</Text>
                                    <Text style={styles.infoValue}>{profile?.phone || "-"}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <MaterialIcons name="restaurant-menu" size={20} color={COLORS.secondary} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Comidas favoritas</Text>
                                    <Text style={styles.infoValue}>
                                        {Array.isArray(profile?.favoriteFoods) 
                                            ? profile.favoriteFoods.join(", ") 
                                            : (profile?.favoriteFoods || "-")}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <MaterialIcons name="email" size={20} color={COLORS.secondary} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{profile?.email || "-"}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <MaterialIcons name="badge" size={20} color={COLORS.secondary} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Usuario</Text>
                                    <Text style={styles.infoValue}>{profile?.username || "-"}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </Card>

                <SecuritySection />

                <Button
                    title="Cerrar Sesión"
                    onPress={handleLogout}
                    variant="secondary"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: "center",
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    avatarContainer: {
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    name: {
        fontSize: FONT_SIZE.huge,
        fontWeight: "800",
        color: COLORS.text,
        marginBottom: SPACING.xs,
        letterSpacing: 0.5,
    },
    email: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        marginBottom: SPACING.md,
        fontWeight: "500",
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceVariant,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    editButtonText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.primary,
    },
    content: {
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: SPACING.md,
        letterSpacing: 0.3,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    infoContent: {
        marginLeft: SPACING.md,
        flex: 1,
    },
    infoLabel: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginBottom: 2,
        fontWeight: "500",
    },
    infoValue: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        fontWeight: "600",
    },
});

export default ProfileScreen;
