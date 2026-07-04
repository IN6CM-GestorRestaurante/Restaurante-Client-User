// src/features/auth/screens/LoginScreen.jsx
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const LoginScreen = ({ navigation }) => {
    const { handleLogin, loading } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            emailOrUsername: "",
            password: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            await handleLogin(data);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Error al iniciar sesión";
            Alert.alert("Error", message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image 
                    source={require("../../../../assets/icon.png")} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Gestor Restaurante</Text>
                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
            </View>

            <View style={styles.form}>
                <Controller
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Correo o usuario"
                            placeholder="ejemplo@restaurante.com"
                            value={value}
                            onChangeText={onChange}
                            error={errors.emailOrUsername?.message}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    )}
                    name="emailOrUsername"
                />

                <Controller
                    control={control}
                    rules={{ required: "La contraseña es requerida" }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Contraseña"
                            placeholder="••••••••"
                            value={value}
                            onChangeText={onChange}
                            error={errors.password?.message}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    )}
                    name="password"
                />

                <Button
                    title="Iniciar Sesión"
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                />

                <TouchableOpacity 
                    style={styles.forgotPassword}
                    onPress={() => navigation.navigate("Restore")}
                    activeOpacity={0.7}
                >
                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.link}>Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.xl,
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: SPACING.xxl,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: SPACING.lg,
        borderRadius: 50,
        backgroundColor: COLORS.surfaceVariant,
        padding: SPACING.md,
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
        textAlign: "center",
        fontWeight: "500",
    },
    form: {
        marginBottom: SPACING.xl,
    },
    forgotPassword: {
        alignItems: "center",
        marginTop: SPACING.md,
    },
    forgotPasswordText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.primary,
    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: SPACING.lg,
    },
    footerText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        marginRight: SPACING.xs,
    },
    link: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.primary,
    },
});

export default LoginScreen;