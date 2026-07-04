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
    TextInput,
    ImageBackground
} from "react-native"

import { useForm, Controller } from "react-hook-form"
import { useAuth } from "../hooks/useAuth"
import Input from "../../../shared/components/Input"
import Button from "../../../shared/components/Button"
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme"

const fondoCocina = require("../../../../assets/fondo_cocina.png");

const ForgotPasswordScreen = ({ navigation }) => {
    const { handleRecoverPassword, loading } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = async (data) => {
        try {
            if (handleRecoverPassword) {
                await handleRecoverPassword(data.email)
                Alert.alert(
                    "Correo enviado", 
                    "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña."
                )
                navigation.navigate("Login")
            } else {
                Alert.alert("Aviso", "La recuperación de contraseña está en construcción.");
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Error al procesar la solicitud"
            Alert.alert("Error", message)
        }
    }

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
                                <Text style={styles.title}>Recuperar cuenta</Text>
                                <Text style={styles.subtitle}>
                                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                                </Text>
                            </View>

                            <View style={styles.form}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "El email es requerido",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Dirección de correo inválida"
                                        }
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            label="Correo electrónico"
                                            placeholder="correo@ejemplo.com"
                                            value={value}
                                            onChangeText={onChange}
                                            error={errors.email?.message}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    )}
                                    name="email"
                                />

                                <Button
                                    title={loading ? "Enviando..." : "Enviar enlace"}
                                    onPress={handleSubmit(onSubmit)}
                                    loading={loading}
                                />
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>¿Recordaste tu contraseña?</Text>
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate("Login")}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.registerLink}>Inicia Sesión</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    )
}

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

export default ForgotPasswordScreen;