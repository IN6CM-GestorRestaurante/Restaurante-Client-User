import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ImageBackground
} from "react-native"

import { useForm, Controller } from "react-hook-form"
import { SPACING, FONT_SIZE } from "../../../shared/constants/theme"
import Input from "../../../shared/components/Input"
import Button from "../../../shared/components/Button"
import { useAuth } from "../hooks/useAuth"

const fondoImage = require("../../../../assets/fondo.jpg");

const RegisterScreen = ({ navigation }) => {
    const { handleRegister, loading } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        try {
            if (handleRegister) {
                await handleRegister(data)
            } else {
                Alert.alert("Aviso", "El registro está en construcción.");
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Error al registrarse"
            Alert.alert("Error", message)
        }
    }

    return (
        <ImageBackground source={fondoImage} style={styles.backgroundImage}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.overlay}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Gestor Restaurante</Text>
                            <Text style={styles.subtitle}>Crea una nueva cuenta</Text>
                        </View>

                        <View style={styles.form}>
                            <Controller
                                control={control}
                                rules={{ required: "Usuario requerido" }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Usuario"
                                        placeholder="Tu usuario"
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        error={errors.username?.message}
                                    />
                                )}
                                name="username"
                            />

                            <Controller
                                control={control}
                                rules={{ required: "Email requerido" }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Email"
                                        placeholder="correo@ejemplo.com"
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        error={errors.email?.message}
                                    />
                                )}
                                name="email"
                            />

                            <Controller
                                control={control}
                                rules={{ required: "Contraseña requerida" }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Contraseña"
                                        placeholder="••••••••"
                                        secureTextEntry
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        error={errors.password?.message}
                                    />
                                )}
                                name="password"
                            />

                            <Controller
                                control={control}
                                rules={{ required: "Confirma tu contraseña" }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Confirmar Contraseña"
                                        placeholder="••••••••"
                                        secureTextEntry
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        error={errors.confirmPassword?.message}
                                    />
                                )}
                                name="confirmPassword"
                            />

                            <Button
                                title={loading ? "Cargando..." : "Registrarse"}
                                onPress={handleSubmit(onSubmit)}
                                style={styles.button}
                            />

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                                <Text
                                    style={styles.link}
                                    onPress={() => navigation.navigate("Login")}
                                >
                                    Inicia Sesión
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING?.xl || 24,
        justifyContent: "center",
    },
    overlay: {
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        padding: SPACING?.xl || 24,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    header: {
        alignItems: "center",
        marginBottom: SPACING?.xxl || 32,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FF7A00",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: FONT_SIZE?.lg || 16,
        color: "#555555",
    },
    form: {
        width: "100%",
    },
    button: {
        marginTop: SPACING?.lg || 20,
        backgroundColor: "#FF7A00",
        borderRadius: 8,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: SPACING?.xl || 24,
    },
    footerText: {
        fontSize: FONT_SIZE?.md || 14,
        color: "#444444",
    },
    link: {
        fontSize: FONT_SIZE?.md || 14,
        color: "#FF7A00",
        fontWeight: "bold",
    },
});

export default RegisterScreen;
