// src/features/orders/hooks/useOrders.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";

const mapOrder = (o) => ({
    id: o._id || o.id,
    tableNumber: o.table?.number ?? "N/A",
    status: o.status || "pending",
    total: o.total || 0,
    items: o.items || [],
    createdAt: o.createdAt || new Date().toISOString(),
});

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userClient.get("/orders/me/history");
            const raw = response.data?.data ?? [];
            setOrders(Array.isArray(raw) ? raw.map(mapOrder) : []);
        } catch (err) {
            console.warn("Error fetching orders:", err);
            setError(err.response?.data?.message ?? "Error al cargar las órdenes");
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelOrder = useCallback(async (orderId) => {
        const response = await userClient.put(`/orders/${orderId}/cancel`);
        await fetchOrders();
        return response.data;
    }, [fetchOrders]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, error, refetch: fetchOrders, cancelOrder };
};
