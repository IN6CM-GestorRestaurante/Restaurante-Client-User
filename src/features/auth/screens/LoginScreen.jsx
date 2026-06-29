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
        <ImageBackground source={fondoCocina} style={styles.backgroundImage} resizeMode="cover">
            {/* Capa oscura muy sutil para apagar un poco el fondo y resaltar la tarjeta */}
            <View style={styles.darkOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent} 
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Tarjeta del formulario (Fondo blanco sutil) */}
                        <View style={styles.cardContainer}>
                            
                            <View style={styles.header}>
                                <Text style={styles.title}>Gestor Restaurante</Text>
                                <Text style={styles.subtitle}>
                                    Administra tu inventario y personal al instante.
                                </Text>
                            </View>

                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Correo o usuario</Text>
                                    <Controller
                                        control={control}
                                        rules={{ required: "Este campo es requerido" }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                style={[styles.input, errors.emailOrUsername && styles.inputError]}
                                                placeholder="ejemplo@restaurante.com"
                                                placeholderTextColor="#A0A0A0"
                                                onChangeText={onChange}
                                                value={value}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                            />
                                        )}
                                        name="emailOrUsername"
                                    />
                                    {errors.emailOrUsername && (
                                        <Text style={styles.errorText}>{errors.emailOrUsername.message}</Text>
                                    )}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Contraseña</Text>
                                    <Controller
                                        control={control}
                                        rules={{ required: "La contraseña es requerida" }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                style={[styles.input, errors.password && styles.inputError]}
                                                placeholder="••••••••"
                                                placeholderTextColor="#A0A0A0"
                                                secureTextEntry
                                                onChangeText={onChange}
                                                value={value}
                                                autoCapitalize="none"
                                            />
                                        )}
                                        name="password"
                                    />
                                    {errors.password && (
                                        <Text style={styles.errorText}>{errors.password.message}</Text>
                                    )}
                                </View>

                                <TouchableOpacity 
                                    style={styles.forgotPasswordButton}
                                    onPress={() => navigation.navigate("Restore")}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                                    
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.primaryButton}
                                    onPress={handleSubmit(onSubmit)}
                                    activeOpacity={0.8}
                                    disabled={loading}
                                >
                                    <Text style={styles.primaryButtonText}>
                                        {loading ? "Verificando..." : "Iniciar Sesión"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>¿No tienes una cuenta aún?</Text>
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate("Register")}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.registerLink}>Regístrate aquí</Text>
                                </TouchableOpacity>
                            </View>

                            //PRUEBA PARA VISTAS
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>¿INGRESAR SIN INICIAR SESION?</Text>
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate("Menus")}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.registerLink}>Ingresar como invitado</Text>
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
        marginBottom: 18,
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
    forgotPasswordButton: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#D94A00", 
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

export default LoginScreen;