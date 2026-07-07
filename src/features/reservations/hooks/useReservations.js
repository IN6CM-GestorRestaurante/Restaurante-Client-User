// src/features/reservations/hooks/useReservations.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";

const mapReservation = (r) => ({
    id: r._id || r.id,
    type: r.type,
    date: r.date,
    status: r.status,
    totalPrice: r.totalPrice,
    notes: r.notes,
    restaurantName: r.restaurant?.name,
    tableNumber: r.table?.number,
});

export const useReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMyReservations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userClient.get("/reservations/me/history");
            const raw = response.data?.data ?? [];
            setReservations(Array.isArray(raw) ? raw.map(mapReservation) : []);
        } catch (err) {
            console.warn("Error fetching reservations:", err);
            setError(err.response?.data?.message || "Error al cargar tus reservaciones");
        } finally {
            setLoading(false);
        }
    }, []);

    const createReservation = useCallback(async (data) => {
        const response = await userClient.post("/reservations", data);
        await fetchMyReservations();
        return response.data;
    }, [fetchMyReservations]);

    const cancelReservation = useCallback(async (id) => {
        const response = await userClient.put(`/reservations/${id}/cancel`);
        await fetchMyReservations();
        return response.data;
    }, [fetchMyReservations]);

    useEffect(() => {
        fetchMyReservations();
    }, [fetchMyReservations]);

    return {
        reservations,
        loading,
        error,
        refetch: fetchMyReservations,
        createReservation,
        cancelReservation,
    };
};
