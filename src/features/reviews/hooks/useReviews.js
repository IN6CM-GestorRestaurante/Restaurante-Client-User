// src/features/reviews/hooks/useReviews.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";

export const useReviews = (branchId) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [myReview, setMyReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMyReviewForBranch = useCallback(async () => {
        try {
            const response = await userClient.get("/reviews/me");
            const mine = (response.data?.data || []).find(
                (r) => (r.restaurant?._id || r.restaurant) === branchId
            );
            return mine || null;
        } catch {
            return null;
        }
    }, [branchId]);

    const fetchReviews = useCallback(async () => {
        if (!branchId) return;
        setLoading(true);
        setError(null);
        try {
            const [response, mine] = await Promise.all([
                userClient.get(`/reviews/branch/${branchId}`),
                fetchMyReviewForBranch(),
            ]);
            setReviews(response.data?.reviews || []);
            setAverageRating(response.data?.averageRating || 0);
            setTotalReviews(response.data?.totalReviews || 0);
            setMyReview(mine);
        } catch (err) {
            console.warn("Error fetching reviews:", err);
            setError(err.response?.data?.message || "Error al cargar las reseñas");
        } finally {
            setLoading(false);
        }
    }, [branchId, fetchMyReviewForBranch]);

    const submitReview = useCallback(async (rating, comment) => {
        await userClient.post("/reviews", { restaurant: branchId, rating, comment });
        await fetchReviews();
    }, [branchId, fetchReviews]);

    const editReview = useCallback(async (reviewId, rating, comment) => {
        await userClient.put(`/reviews/${reviewId}`, { rating, comment });
        await fetchReviews();
    }, [fetchReviews]);

    const removeReview = useCallback(async (reviewId) => {
        await userClient.delete(`/reviews/${reviewId}`);
        await fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return {
        reviews,
        averageRating,
        totalReviews,
        myReview,
        loading,
        error,
        refetch: fetchReviews,
        submitReview,
        editReview,
        removeReview,
    };
};
