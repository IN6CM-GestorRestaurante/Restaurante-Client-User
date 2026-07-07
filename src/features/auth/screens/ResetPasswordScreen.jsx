import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    TouchableOpacity,
    ImageBackground
} from "react-native"

import { useForm, Controller } from "react-hook-form"
import { useAuth } from "../hooks/useAuth"
import Input from "../../../shared/components/Input"
import Button from "../../../shared/components/Button"
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme"

const fondoCocina = require("../../../../assets/fondo_cocina.png");

// Acepta tanto el token puro como el enlace completo del correo
// (ej. https://.../reset-password?token=XYZ) y extrae el token.
const extractToken = (input) => {
    const trimmed = (input || "").trim();
    const match = trimmed.match(/[?&]token=([^&\s]+)/);
    return match ? decodeURIComponent(match[1]) : trimmed;
};

const ResetPasswordScreen = ({ navigation }) => {
    const { handleResetPassword, loading } = useAuth();

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            token: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    const newPassword = watch("newPassword");

    const onSubmit = async (data) => {
        try {
            const token = extractToken(data.token);
            await handleResetPassword(token, data.newPassword);
            Alert.alert("Contraseña actualizada", "Ya puedes iniciar sesión con tu nueva contraseña.", [
                { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") }
            ]);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "El código es inválido o ya expiró";
            Alert.alert("Error", message);
        }
    };

    return (
        <ImageBackground source={fondoCocina} style={styles.backgroundImage} resizeMode="cover">
            <View style={styles.darkOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.cardContainer}>

                            <View style={styles.header}>
                                <Text style={styles.title}>Restablecer contraseña</Text>
                                <Text style={styles.subtitle}>
                                    Pega aquí el código o el enlace completo que recibiste por correo, y elige tu nueva contraseña.
                                </Text>
                            </View>

                            <View style={styles.form}>
                                <Controller
                                    control={control}
                                    rules={{ required: "El código es requerido" }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="Código o enlace recibido"
                                            placeholder="Pega aquí el código o el enlace"
                                            value={value}
                                            onChangeText={onChange}
                                            error={errors.token?.message}
                                            autoCapitalize="none"
                                        />
                                    )}
                                    name="token"
                                />

                                <Controller
                                    control={control}
                                    rules={{
                                        required: "La nueva contraseña es requerida",
                                        minLength: { value: 6, message: "Debe tener al menos 6 caracteres" }
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="Nueva contraseña"
                                            placeholder="••••••••"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                            error={errors.newPassword?.message}
                                            autoCapitalize="none"
                                        />
                                    )}
                                    name="newPassword"
                                />

                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Debes confirmar la nueva contraseña",
                                        validate: (value) => value === newPassword || "Las contraseñas no coinciden"
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="Confirmar nueva contraseña"
                                            placeholder="••••••••"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                            error={errors.confirmPassword?.message}
                                            autoCapitalize="none"
                                        />
                                    )}
                                    name="confirmPassword"
                                />

                                <Button
                                    title={loading ? "Actualizando..." : "Restablecer contraseña"}
                                    onPress={handleSubmit(onSubmit)}
                                    loading={loading}
                                />
                            </View>

                            <View style={styles.footer}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Login")}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.registerLink}>Volver a iniciar sesión</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    darkOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: SPACING.xl,
    },
    cardContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderRadius: 24,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xxl,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    header: {
        alignItems: "center",
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: "800",
        color: COLORS.text,
        marginBottom: SPACING.sm,
        textAlign: "center",
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        textAlign: "center",
        lineHeight: 20,
        paddingHorizontal: SPACING.sm,
        fontWeight: "500",
    },
    form: {
        width: "100%",
    },
    footer: {
        marginTop: SPACING.xl,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    footerText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        marginRight: SPACING.xs,
        fontWeight: "500",
    },
    registerLink: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.primary,
    },
});

export default ResetPasswordScreen;
