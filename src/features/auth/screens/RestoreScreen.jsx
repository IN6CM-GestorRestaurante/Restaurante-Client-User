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
                                
                                {/* Input Email */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Correo electrónico</Text>
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
                                            <TextInput
                                                style={[styles.input, errors.email && styles.inputError]}
                                                placeholder="correo@ejemplo.com"
                                                placeholderTextColor="#A0A0A0"
                                                onChangeText={onChange}
                                                value={value}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                            />
                                        )}
                                        name="email"
                                    />
                                    {errors.email && (
                                        <Text style={styles.errorText}>{errors.email.message}</Text>
                                    )}
                                </View>

                                <TouchableOpacity 
                                    style={styles.primaryButton}
                                    onPress={handleSubmit(onSubmit)}
                                    activeOpacity={0.8}
                                    disabled={loading}
                                >
                                    <Text style={styles.primaryButtonText}>
                                        {loading ? "Enviando..." : "Enviar enlace"}
                                    </Text>
                                </TouchableOpacity>
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
        padding: 24,
    },
    cardContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.96)", 
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    form: {
        width: "100%",
    },
    inputGroup: {
        marginBottom: 24, 
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 52,
        backgroundColor: "#F7F8FA", 
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 15,
        color: "#1A1A1A",
    },
    inputError: {
        borderColor: "#EF4444",
        backgroundColor: "#FEF2F2",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    primaryButton: {
        backgroundColor: "#E65100", 
        height: 54,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#E65100",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    footer: {
        marginTop: 32,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    footerText: {
        fontSize: 14,
        color: "#666666",
        marginRight: 6,
    },
    registerLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#D94A00",
    },
});

export default ForgotPasswordScreen;