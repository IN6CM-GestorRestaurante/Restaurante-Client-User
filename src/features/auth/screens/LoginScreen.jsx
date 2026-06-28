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

// Asegúrate de que esta ruta coincida exactamente con la ubicación de tu archivo desde la carpeta actual
const fondoImage = require("../../../../assets/fondo.jpg");

const LoginScreen = ({ navigation }) => {
    const { handleLogin, loading } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            emailOrUsername: "",
            password: ""
        }
    })

    const onSubmit = async (data) => {
        try {
            await handleLogin(data)
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Error al iniciar sesión"
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
                    {/* Contenedor tipo tarjeta para mejorar la lectura sobre el fondo */}
                    <View style={styles.overlay}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Gestor Restaurante</Text>
                            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
                        </View>

                        <View style={styles.form}>
                            <Controller
                                control={control}
                                rules={{ required: "Email o usuario requerido" }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Email o usuario"
                                        placeholder="correo@ejemplo.com o usuario"
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        error={errors.emailOrUsername?.message}
                                    />
                                )}
                                name="emailOrUsername"
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

                            <Button
                                title="Iniciar Sesión"
                                onPress={handleSubmit(onSubmit)}
                                style={styles.button}
                            // Si tu componente Button acepta una prop para sobreescribir el color, agrégala aquí
                            // color="#FF8C00"
                            />

                            <View style={styles.footer}>
                                {/* Se corrigió el error tipográfico "sytle" a "style" */}
                                <Text style={styles.footerText}>¿No tienes cuenta? </Text>
                                <Text
                                    style={styles.link}
                                    onPress={() => navigation.navigate("Register")}
                                >
                                    Regístrate
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
        backgroundColor: "rgba(255, 255, 255, 0.92)", // Fondo blanco semitransparente
        padding: SPACING?.xl || 24,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8, // Sombra para Android
    },
    header: {
        alignItems: "center",
        marginBottom: SPACING?.xxl || 32,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FF7A00", // Tema Naranja
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
        backgroundColor: "#FF7A00", // Tema Naranja para el botón
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
        color: "#FF7A00", // Tema Naranja para el enlace
        fontWeight: "bold",
    },
});

export default LoginScreen;