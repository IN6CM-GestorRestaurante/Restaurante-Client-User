// src/features/auth/screens/RegisterScreen.jsx
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, Image, Modal, FlatList } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const COUNTRIES = [
    { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', length: 8 },
    { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽', length: 10 },
    { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸', length: 10 },
    { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻', length: 8 },
    { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳', length: 8 },
    { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', length: 8 },
    { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', length: 10 },
    { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', length: 10 },
    { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸', length: 9 },
];

const RegisterScreen = ({ navigation }) => {
    const { handleRegister, handleVerifyEmail, loading } = useAuth();
    const [step, setStep] = useState(1);
    
    // Estado y referencias para el OTP
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);

    // Estado para el Country Picker
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

    const { control, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm({
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: ""
        }
    });

    const handleRegisterSubmit = async (data) => {
        try {
            // Concatenamos el código de país al teléfono antes de enviarlo
            const fullPhone = data.phone ? `${selectedCountry.dialCode} ${data.phone}` : "";
            const payload = {
                ...data,
                phone: fullPhone,
                username: data.email.split("@")[0]
            };
            await handleRegister(payload);
            // Al ser exitoso el registro, pasamos al Paso 4 para ingresar el OTP enviado
            setStep(4);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Error al registrarse";
            Alert.alert("Error", message);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    
    const handleNext = async () => {
        let isValid = false;
        
        if (step === 1) {
            isValid = await trigger(["name", "surname", "email"]);
        } else if (step === 2) {
            isValid = await trigger(["password", "confirmPassword"]);
            // Validar que coincidan
            if (isValid && watch("password") !== watch("confirmPassword")) {
                Alert.alert("Error", "Las contraseñas no coinciden.");
                isValid = false;
            }
        }

        if (isValid) {
            nextStep();
        }
    };

    const handleVerifyOtpSubmit = async () => {
        const token = otp.join('');
        if (token.length !== 6) {
            Alert.alert("Atención", "Por favor ingresa el código completo de 6 dígitos.");
            return;
        }
        try {
            await handleVerifyEmail(token);
            Alert.alert("Éxito", "Cuenta verificada correctamente. Inicia sesión.", [
                { text: "OK", onPress: () => navigation.navigate("Login") }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", error.response?.data?.message || "Código inválido");
        }
    };

    // Lógica para OTP
    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        
        // Manejar pegado de código completo (ej. 123456)
        if (text.length > 1) {
            const pastedCode = text.replace(/[^0-9]/g, '').slice(0, 6).split('');
            pastedCode.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            
            // Enfocar el último input llenado o el último posible
            const nextIndex = Math.min(index + pastedCode.length, 5);
            otpRefs.current[nextIndex]?.focus();
            return;
        }

        // Manejar ingreso de un solo dígito
        newOtp[index] = text;
        setOtp(newOtp);

        if (text !== "" && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === "" && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // Lógica para Teléfono
    const handlePhoneChange = (text, onChange) => {
        // Remover cualquier letra o símbolo, dejar solo números
        const numericText = text.replace(/[^0-9]/g, '');
        onChange(numericText);
    };

    const renderLogo = () => (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Image 
                    source={require("../../../../assets/fondo_cocina.png")} 
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>
        </View>
    );

    const renderCountryModal = () => (
        <Modal
            visible={isCountryModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsCountryModalVisible(false)}
        >
            <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPress={() => setIsCountryModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Selecciona tu país</Text>
                    <FlatList
                        data={COUNTRIES}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.countryItem}
                                onPress={() => {
                                    setSelectedCountry(item);
                                    // Limpiamos el teléfono si cambiamos de país para evitar que exceda el maxLength
                                    setValue("phone", ""); 
                                    setIsCountryModalVisible(false);
                                }}
                            >
                                <Text style={styles.countryItemFlag}>{item.flag}</Text>
                                <Text style={styles.countryItemName}>{item.name}</Text>
                                <Text style={styles.countryItemCode}>{item.dialCode}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <View style={styles.container}>
            {renderLogo()}
            {renderCountryModal()}
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.cardBox}>
                    {step === 1 && (
                        <>
                            <Text style={styles.title}>Crear una cuenta</Text>
                            <View style={styles.form}>
                                <Controller control={control} rules={{ required: "El nombre es requerido" }} name="name"
                                    render={({ field: { onChange, value } }) => (
                                        <Input placeholder="Nombre" value={value} onChangeText={onChange}
                                            error={errors.name?.message} iconName="person-outline" />
                                    )}
                                />
                                <Controller control={control} rules={{ required: "El apellido es requerido" }} name="surname"
                                    render={({ field: { onChange, value } }) => (
                                        <Input placeholder="Apellidos" value={value} onChangeText={onChange}
                                            error={errors.surname?.message} iconName="person-outline" />
                                    )}
                                />
                                <Controller control={control} 
                                    rules={{ 
                                        required: "El correo es requerido",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Correo electrónico no válido"
                                        }
                                    }} 
                                    name="email"
                                    render={({ field: { onChange, value } }) => (
                                        <Input placeholder="Correo Electrónico" value={value} onChangeText={onChange}
                                            error={errors.email?.message} iconName="mail-outline"
                                            autoCapitalize="none" keyboardType="email-address" />
                                    )}
                                />
                                <Button title="Continuar" onPress={handleNext} />
                            </View>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Text style={styles.title}>Completar creación{"\n"}de la cuenta</Text>
                            <View style={styles.form}>
                                <Controller control={control} rules={{ required: "Requerido" }} name="password"
                                    render={({ field: { onChange, value } }) => (
                                        <Input placeholder="Contraseña" value={value} onChangeText={onChange}
                                            error={errors.password?.message} iconName="lock-outline" secureTextEntry />
                                    )}
                                />
                                <Controller control={control} rules={{ required: "Requerido" }} name="confirmPassword"
                                    render={({ field: { onChange, value } }) => (
                                        <Input placeholder="Confirmar contraseña" value={value} onChangeText={onChange}
                                            error={errors.confirmPassword?.message} iconName="lock-outline" secureTextEntry />
                                    )}
                                />
                                <Button title="Continuar" onPress={handleNext} />
                            </View>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <Text style={styles.title}>Paso opcional</Text>
                            <Text style={styles.subtitle}>
                                Algunos restaurantes cuentan con servicio de domicilio (delivery) y el teléfono es necesario para que el repartidor lo contacte.{"\n"}
                                El número de teléfono puede ser agregado posteriormente en la configuración de la cuenta del usuario.
                            </Text>
                            <View style={styles.phoneRow}>
                                <TouchableOpacity 
                                    style={styles.countryPill}
                                    onPress={() => setIsCountryModalVisible(true)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.countryText}>{selectedCountry.flag} {selectedCountry.dialCode}</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1 }}>
                                    <Controller control={control} name="phone"
                                        rules={{ 
                                            // Validación opcional, pero si se escribe debe cumplir la longitud
                                            validate: (val) => !val || val.length === selectedCountry.length || `El teléfono debe tener ${selectedCountry.length} dígitos`
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input 
                                                placeholder={`Teléfono (${selectedCountry.length} dígitos)`} 
                                                value={value} 
                                                onChangeText={(text) => handlePhoneChange(text, onChange)}
                                                iconName="phone" 
                                                keyboardType="number-pad"
                                                maxLength={selectedCountry.length}
                                                error={errors.phone?.message}
                                            />
                                        )}
                                    />
                                </View>
                            </View>
                            <Button title="Confirmar Registro" onPress={handleSubmit(handleRegisterSubmit)} loading={loading} />
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <Text style={styles.title}>Enviamos un código{"\n"}a su correo</Text>
                            <Text style={styles.subtitle}>Introduce el código de verificación de 6 dígitos que fue enviado al correo ingresado</Text>
                            <View style={styles.otpContainer}>
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <TextInput 
                                        key={index} 
                                        ref={el => otpRefs.current[index] = el}
                                        style={styles.otpBox} 
                                        maxLength={6} 
                                        keyboardType="number-pad" 
                                        value={otp[index]}
                                        onChangeText={(text) => handleOtpChange(text, index)}
                                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                        selectTextOnFocus
                                    />
                                ))}
                            </View>
                            <Button title="Verificar Cuenta" onPress={handleVerifyOtpSubmit} loading={loading} />
                        </>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.link}>Inicia sesión aquí</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: "center",
        marginTop: SPACING.xxl * 1.5,
        marginBottom: SPACING.xl,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    logoImage: {
        width: 100,
        height: 100,
        marginBottom: SPACING.md,
    },
    logoText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.primary,
        marginTop: SPACING.xs,
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xl,
        alignItems: "center",
    },
    cardBox: {
        width: "100%",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: SPACING.xl,
        textAlign: "center",
        lineHeight: 28,
    },
    subtitle: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.text,
        textAlign: "center",
        marginBottom: SPACING.xl,
        lineHeight: 20,
    },
    form: {
        width: "100%",
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: SPACING.xl,
    },
    otpBox: {
        width: 40,
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        color: COLORS.text,
        fontSize: FONT_SIZE.lg,
        textAlign: "center",
    },
    phoneRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    countryPill: {
        height: 54, 
        paddingHorizontal: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    countryText: {
        color: COLORS.text,
        fontSize: FONT_SIZE.md,
    },
    skipButton: {
        marginTop: SPACING.lg,
        alignItems: "center",
    },
    skipText: {
        color: COLORS.textLight,
        fontSize: FONT_SIZE.md,
        fontWeight: "600",
        textDecorationLine: "underline",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: COLORS.surfaceVariant,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.lg,
        maxHeight: "70%",
    },
    modalTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: SPACING.md,
        textAlign: "center",
    },
    countryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    countryItemFlag: {
        fontSize: FONT_SIZE.xl,
        marginRight: SPACING.md,
    },
    countryItemName: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
    },
    countryItemCode: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    footerText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.text,
        marginRight: SPACING.xs,
    },
    link: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "bold",
        color: COLORS.text,
    },
});

export default RegisterScreen;