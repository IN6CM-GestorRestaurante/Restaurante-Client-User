// src/features/reservations/screens/MyReservationsScreen.jsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useReservations } from "../hooks/useReservations";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const STATUS_COLORS = {
    Pendiente: COLORS.warning,
    Confirmada: COLORS.info,
    "En curso": COLORS.primary,
    Completada: COLORS.success,
    Cancelada: COLORS.error,
};

const CANCELLABLE_STATUSES = ["Pendiente", "Confirmada", "En curso"];

const MyReservationsScreen = () => {
    const { reservations, loading, error, refetch, cancelReservation } = useReservations();

    const handleCancel = (reservation) => {
        Alert.alert("Cancelar reservación", "¿Estás seguro de que quieres cancelarla?", [
            { text: "No", style: "cancel" },
            {
                text: "Sí, cancelar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await cancelReservation(reservation.id);
                    } catch (err) {
                        Alert.alert("Error", err.response?.data?.message || "No se pudo cancelar la reservación");
                    }
                },
            },
        ]);
    };

    if (loading && reservations.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Reservaciones</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
            >
                {error ? (
                    <EmptyState message={error} />
                ) : reservations.length === 0 ? (
                    <EmptyState message="Todavía no tienes reservaciones" />
                ) : (
                    reservations.map((r) => (
                        <Card key={r.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.dateText}>
                                    {new Date(r.date).toLocaleString("es-GT", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </Text>
                                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[r.status] || COLORS.textLight }]}>
                                    <Text style={styles.statusText}>{r.status}</Text>
                                </View>
                            </View>
                            {r.tableNumber && (
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="table-restaurant" size={16} color={COLORS.secondary} />
                                    <Text style={styles.infoText}>Mesa {r.tableNumber}</Text>
                                </View>
                            )}
                            {r.notes ? <Text style={styles.notes}>{r.notes}</Text> : null}
                            {CANCELLABLE_STATUSES.includes(r.status) && (
                                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(r)}>
                                    <MaterialIcons name="cancel" size={18} color={COLORS.error} />
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                            )}
                        </Card>
                    ))
                )}
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
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.primary,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    card: {
        marginBottom: SPACING.md,
        gap: SPACING.xs,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.xs,
    },
    dateText: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.text,
    },
    statusBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: COLORS.surface,
        fontSize: FONT_SIZE.xs,
        fontWeight: "700",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
    },
    infoText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
    },
    notes: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        fontStyle: "italic",
    },
    cancelButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
        marginTop: SPACING.sm,
        alignSelf: "flex-start",
    },
    cancelText: {
        color: COLORS.error,
        fontWeight: "700",
        fontSize: FONT_SIZE.sm,
    },
});

export default MyReservationsScreen;
