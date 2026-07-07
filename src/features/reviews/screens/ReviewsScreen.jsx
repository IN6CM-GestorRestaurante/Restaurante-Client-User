// src/features/reviews/screens/ReviewsScreen.jsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useReviews } from "../hooks/useReviews";
import { useDefaultBranch } from "../../../shared/hooks/useDefaultBranch";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/Common";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import StarRating from "../components/StarRating";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";

const ReviewsScreen = () => {
    const { branch } = useDefaultBranch();
    const branchId = branch?._id || branch?.id;
    const {
        reviews,
        averageRating,
        totalReviews,
        myReview,
        loading,
        refetch,
        submitReview,
        editReview,
        removeReview,
    } = useReviews(branchId);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [editing, setEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (myReview) {
            setRating(myReview.rating);
            setComment(myReview.comment || "");
        } else {
            setRating(0);
            setComment("");
        }
    }, [myReview]);

    const onSubmit = async () => {
        if (rating < 1) {
            Alert.alert("Calificación requerida", "Selecciona al menos 1 estrella");
            return;
        }
        setSubmitting(true);
        try {
            if (myReview) {
                await editReview(myReview._id, rating, comment);
            } else {
                await submitReview(rating, comment);
            }
            setEditing(false);
            Alert.alert("¡Gracias!", "Tu reseña se guardó correctamente.");
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "No se pudo guardar tu reseña");
        } finally {
            setSubmitting(false);
        }
    };

    const onDelete = () => {
        Alert.alert("Eliminar reseña", "¿Estás seguro?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await removeReview(myReview._id);
                    } catch (err) {
                        Alert.alert("Error", err.response?.data?.message || "No se pudo eliminar tu reseña");
                    }
                },
            },
        ]);
    };

    if (loading && reviews.length === 0) {
        return <LoadingSpinner />;
    }

    const showForm = !myReview || editing;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Reseñas</Text>
                <View style={styles.averageRow}>
                    <MaterialIcons name="star" size={22} color={COLORS.warning} />
                    <Text style={styles.averageText}>{averageRating.toFixed(1)}</Text>
                    <Text style={styles.totalText}>({totalReviews})</Text>
                </View>
            </View>

            {myReview && !editing && (
                <Card style={styles.myReviewCard}>
                    <Text style={styles.myReviewLabel}>Ya dejaste una reseña</Text>
                    <View style={styles.myReviewActions}>
                        <TouchableOpacity onPress={() => setEditing(true)} style={styles.actionButton}>
                            <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                            <Text style={styles.actionText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                            <MaterialIcons name="delete" size={18} color={COLORS.error} />
                            <Text style={[styles.actionText, { color: COLORS.error }]}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            )}

            {showForm && (
                <Card style={styles.formCard}>
                    <Text style={styles.formTitle}>{myReview ? "Editar tu reseña" : "Deja tu reseña"}</Text>
                    <StarRating value={rating} onChange={setRating} size={32} />
                    <Input
                        label="Comentario"
                        placeholder="Cuéntanos tu experiencia..."
                        value={comment}
                        onChangeText={setComment}
                        multiline
                    />
                    <Button title={myReview ? "Guardar Cambios" : "Publicar Reseña"} onPress={onSubmit} loading={submitting} />
                </Card>
            )}

            {reviews.length === 0 ? (
                <EmptyState message="Todavía no hay reseñas. ¡Sé el primero!" />
            ) : (
                reviews.map((review) => (
                    <Card key={review._id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewerName}>
                                {review.user?.name ? `${review.user.name} ${review.user.surname || ""}`.trim() : review.user?.username || "Usuario"}
                            </Text>
                        </View>
                        <StarRating value={review.rating} readOnly size={16} />
                        {review.comment ? <Text style={styles.reviewComment}>{review.comment}</Text> : null}
                    </Card>
                ))
            )}
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
    averageRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
        marginTop: SPACING.xs,
    },
    averageText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        color: COLORS.text,
    },
    totalText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
    },
    myReviewCard: {
        marginBottom: SPACING.md,
        backgroundColor: COLORS.surfaceVariant,
    },
    myReviewLabel: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    myReviewActions: {
        flexDirection: "row",
        gap: SPACING.lg,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
    },
    actionText: {
        fontWeight: "700",
        fontSize: FONT_SIZE.sm,
        color: COLORS.primary,
    },
    formCard: {
        marginBottom: SPACING.lg,
        gap: SPACING.sm,
    },
    formTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    reviewCard: {
        marginBottom: SPACING.md,
        gap: SPACING.xs,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    reviewerName: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.text,
    },
    reviewComment: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
    },
});

export default ReviewsScreen;
