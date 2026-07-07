// src/features/auth/screens/LoginScreen.jsx
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";
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
                <View style={styles.logoContainer}>
                    <Image 
                        source={require("../../../../assets/icon.png")} 
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <View style={styles.cardBox}>
                <Text style={styles.title}>Iniciar sesión</Text>
                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Username o Correo"
                                value={value}
                                onChangeText={onChange}
                                error={errors.emailOrUsername?.message}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                iconName="person-outline"
                            />
                        )}
                        name="emailOrUsername"
                    />

                    <Controller
                        control={control}
                        rules={{ required: "La contraseña es requerida" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Contraseña"
                                value={value}
                                onChangeText={onChange}
                                error={errors.password?.message}
                                secureTextEntry
                                autoCapitalize="none"
                                iconName="lock-outline"
                            />
                        )}
                        name="password"
                    />

                    <TouchableOpacity 
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate("Restore")}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Submit"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.link}>Regístrate aquí</Text>
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
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surfaceVariant,
        padding: SPACING.md,
    },
    logoText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.primary,
        marginTop: SPACING.xs,
    },
    cardBox: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: SPACING.xl,
        textAlign: "center",
    },
    form: {
        width: "100%",
    },
    forgotPassword: {
        alignItems: "center",
        marginBottom: SPACING.lg,
        marginTop: SPACING.sm,
    },
    forgotPasswordText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.text,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: SPACING.lg,
    },
    footerText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginRight: SPACING.xs,
    },
    link: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "bold",
        color: COLORS.text,
    },
});

export default LoginScreen;