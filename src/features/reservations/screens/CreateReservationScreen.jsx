// src/features/reservations/screens/CreateReservationScreen.jsx
import React, { useState, createElement } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Card } from "../../../shared/components/Common";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useReservations } from "../hooks/useReservations";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const CreateReservationScreen = ({ route, navigation }) => {
    const { tableId, tableNumber, branchId } = route.params || {};
    const { createReservation } = useReservations();

    const [date, setDate] = useState(new Date(Date.now() + 60 * 60 * 1000)); // dentro de 1 hora por defecto
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [guestsCount, setGuestsCount] = useState("2");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        const guests = parseInt(guestsCount, 10);
        if (!guests || guests < 1) {
            Alert.alert("Dato inválido", "Ingresa una cantidad de personas válida");
            return;
        }
        if (date.getTime() <= Date.now()) {
            Alert.alert("Fecha inválida", "La reservación debe ser en una fecha y hora futura");
            return;
        }

        setSubmitting(true);
        try {
            await createReservation({
                restaurant: branchId,
                type: "En Mesa",
                table: tableId,
                date: date.toISOString(),
                guestsCount: guests,
                notes,
            });
            Alert.alert("¡Reservación creada!", "Tu mesa ha quedado pendiente de confirmación.", [
                { text: "Ver mis reservas", onPress: () => navigation.replace("MyReservations") },
            ]);
        } catch (err) {
            if (err.response?.status === 409) {
                Alert.alert(
                    "Mesa no disponible",
                    "Esa mesa ya tiene una reservación cerca de ese horario. Prueba con otra hora o mesa."
                );
            } else {
                Alert.alert("Error", err.response?.data?.message || "No se pudo crear la reservación");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Reservar Mesa {tableNumber}</Text>
                <Text style={styles.subtitle}>Completa los datos de tu reservación</Text>
            </View>

            <Card style={styles.section}>
                <Text style={styles.label}>Fecha</Text>
                {Platform.OS === "web" ? (
                    createElement("input", {
                        type: "date",
                        value: date.toISOString().split("T")[0],
                        min: new Date().toISOString().split("T")[0],
                        onChange: (e) => {
                            const val = e.target.value;
                            if (val) {
                                const newDate = new Date(date);
                                const [y, m, d] = val.split("-");
                                newDate.setFullYear(y, m - 1, d);
                                setDate(newDate);
                            }
                        },
                        style: {
                            padding: "12px 16px",
                            fontSize: "16px",
                            borderRadius: "50px",
                            border: "1px solid #E2E8F0",
                            width: "100%",
                            marginBottom: "16px",
                            outline: "none",
                            color: "#1E293B",
                            fontFamily: "inherit",
                        }
                    })
                ) : (
                    <>
                        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
                            <MaterialIcons name="calendar-today" size={20} color={COLORS.primary} />
                            <Text style={styles.pickerText}>{date.toLocaleDateString("es-GT")}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                minimumDate={new Date()}
                                onChange={(event, selected) => {
                                    setShowDatePicker(Platform.OS === "ios");
                                    if (selected) {
                                        const updated = new Date(date);
                                        updated.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
                                        setDate(updated);
                                    }
                                }}
                            />
                        )}
                    </>
                )}

                <Text style={styles.label}>Hora</Text>
                {Platform.OS === "web" ? (
                    createElement("input", {
                        type: "time",
                        value: date.toTimeString().substring(0, 5),
                        onChange: (e) => {
                            const val = e.target.value;
                            if (val) {
                                const newDate = new Date(date);
                                const [h, min] = val.split(":");
                                newDate.setHours(h, min);
                                setDate(newDate);
                            }
                        },
                        style: {
                            padding: "12px 16px",
                            fontSize: "16px",
                            borderRadius: "50px",
                            border: "1px solid #E2E8F0",
                            width: "100%",
                            marginBottom: "16px",
                            outline: "none",
                            color: "#1E293B",
                            fontFamily: "inherit",
                        }
                    })
                ) : (
                    <>
                        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
                            <MaterialIcons name="access-time" size={20} color={COLORS.primary} />
                            <Text style={styles.pickerText}>
                                {date.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                value={date}
                                mode="time"
                                onChange={(event, selected) => {
                                    setShowTimePicker(Platform.OS === "ios");
                                    if (selected) {
                                        const updated = new Date(date);
                                        updated.setHours(selected.getHours(), selected.getMinutes());
                                        setDate(updated);
                                    }
                                }}
                            />
                        )}
                    </>
                )}

                <Input
                    label="Cantidad de personas"
                    placeholder="2"
                    keyboardType="number-pad"
                    value={guestsCount}
                    onChangeText={setGuestsCount}
                />

                <Input
                    label="Notas (opcional)"
                    placeholder="Alguna petición especial..."
                    value={notes}
                    onChangeText={setNotes}
                />

                <Button title="Confirmar Reservación" onPress={onSubmit} loading={submitting} />
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
    },
    section: {
        gap: SPACING.sm,
    },
    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    pickerButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 50,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        marginBottom: SPACING.md,
    },
    pickerText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        fontWeight: "500",
    },
});

export default CreateReservationScreen;
