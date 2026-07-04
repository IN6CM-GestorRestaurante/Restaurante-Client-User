// src/features/auth/screens/RegisterScreen.jsx
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const RegisterScreen = ({ navigation }) => {
    const { handleRegister, loading } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            surname: "",
            username: "",
            email: "",
            password: "",
            phone: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            await handleRegister(data);
            Alert.alert("Éxito", "Registro completado. Inicia sesión.", [
                { text: "OK", onPress: () => navigation.navigate("Login") }
            ]);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Error al registrarse";
            Alert.alert("Error", message);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Image 
                    source={require("../../../../assets/fondo_cocina.png")} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Regístrate para comenzar</Text>
            </View>

            <View style={styles.form}>
                <Controller
                    control={control}
                    rules={{ required: "El nombre es requerido" }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Nombre"
                            placeholder="Tu nombre"
                            value={value}
                            onChangeText={onChange}
                            error={errors.name?.message}
                        />
                    )}
                    name="name"
                />

                <Controller
                    control={control}
                    rules={{ required: "El apellido es requerido" }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Apellido"
                            placeholder="Tu apellido"
                            value={value}
                            onChangeText={onChange}
                            error={errors.surname?.message}
                        />
                    )}
                    name="surname"
                />

                <Controller
                    control={control}
                    rules={{ required: "El usuario es requerido" }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Usuario"
                            placeholder="Tu usuario"
                            value={value}
                            onChangeText={onChange}
                            error={errors.username?.message}
                            autoCapitalize="none"
                        />
                    )}
                    name="username"
                />

                <Controller
                    control={control}
                    rules={{ required: "El email es requerido" }}
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

                <Controller
                    control={control}
                    rules={{ required: "El teléfono es requerido" }}
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

                <Button
                    title="Registrarse"
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.link}>Inicia Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING.xl,
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: SPACING.xl,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZE.huge,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
    },
    form: {
        marginBottom: SPACING.xl,
    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    footerText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        marginRight: SPACING.xs,
    },
    link: {
        fontSize: FONT_SIZE.md,
        fontWeight: "bold",
        color: COLORS.primary,
    },
});

export default RegisterScreen;