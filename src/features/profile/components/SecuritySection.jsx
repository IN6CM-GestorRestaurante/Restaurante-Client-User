import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "../../../shared/components/Common";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useAuth } from "../../auth/hooks/useAuth";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const SecuritySection = () => {
    const { handleChangePassword, handleDeleteAccount, loading } = useAuth();
    const [showDeleteForm, setShowDeleteForm] = useState(false);

    const passwordForm = useForm({
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });
    const deleteForm = useForm({ defaultValues: { password: "" } });

    const onChangePassword = async (data) => {
        try {
            await handleChangePassword(data.currentPassword, data.newPassword);
            Alert.alert("Contraseña actualizada", "Vuelve a iniciar sesión con tu nueva contraseña.");
            passwordForm.reset();
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "No se pudo cambiar la contraseña");
        }
    };

    const onDeleteAccount = (data) => {
        Alert.alert(
            "Eliminar cuenta",
            "Esta acción es permanente. ¿Confirmas que deseas eliminar tu cuenta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await handleDeleteAccount(data.password);
                        } catch (err) {
                            Alert.alert("Error", err.response?.data?.message || "No se pudo eliminar la cuenta");
                        }
                    },
                },
            ]
        );
    };

    return (
        <>
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>

                <Controller
                    control={passwordForm.control}
                    rules={{ required: "La contraseña actual es obligatoria" }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Contraseña actual"
                            placeholder="••••••••"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                            error={passwordForm.formState.errors.currentPassword?.message}
                        />
                    )}
                    name="currentPassword"
                />

                <Controller
                    control={passwordForm.control}
                    rules={{
                        required: "La nueva contraseña es obligatoria",
                        minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Nueva contraseña"
                            placeholder="••••••••"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                            error={passwordForm.formState.errors.newPassword?.message}
                        />
                    )}
                    name="newPassword"
                />

                <Controller
                    control={passwordForm.control}
                    rules={{
                        required: "Debes confirmar la nueva contraseña",
                        validate: (value) =>
                            value === passwordForm.watch("newPassword") || "Las contraseñas no coinciden",
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Confirmar nueva contraseña"
                            placeholder="••••••••"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                            error={passwordForm.formState.errors.confirmPassword?.message}
                        />
                    )}
                    name="confirmPassword"
                />

                <Button
                    title="Actualizar Contraseña"
                    onPress={passwordForm.handleSubmit(onChangePassword)}
                    loading={loading}
                />
            </Card>

            <Card style={styles.dangerSection}>
                <View style={styles.dangerHeader}>
                    <MaterialIcons name="warning" size={20} color={COLORS.error} />
                    <Text style={styles.dangerTitle}>Eliminar Cuenta</Text>
                </View>
                <Text style={styles.dangerText}>
                    Esta acción desactiva tu cuenta de forma permanente y no podrás iniciar sesión de nuevo.
                </Text>

                {!showDeleteForm ? (
                    <Button
                        title="Quiero eliminar mi cuenta"
                        onPress={() => setShowDeleteForm(true)}
                        variant="secondary"
                    />
                ) : (
                    <>
                        <Controller
                            control={deleteForm.control}
                            rules={{ required: "La contraseña es obligatoria" }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Confirma tu contraseña"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={value}
                                    onChangeText={onChange}
                                    error={deleteForm.formState.errors.password?.message}
                                />
                            )}
                            name="password"
                        />
                        <Button
                            title="Eliminar Cuenta Permanentemente"
                            onPress={deleteForm.handleSubmit(onDeleteAccount)}
                            loading={loading}
                        />
                    </>
                )}
            </Card>
        </>
    );
};

const styles = StyleSheet.create({
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
    dangerSection: {
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    dangerHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    dangerTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.error,
    },
    dangerText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginBottom: SPACING.md,
        lineHeight: 18,
    },
});

export default SecuritySection;
