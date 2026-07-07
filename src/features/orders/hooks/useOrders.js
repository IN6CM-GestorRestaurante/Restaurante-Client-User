// src/features/orders/hooks/useOrders.js
import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userClient from "../../../shared/api/userClient.js";

const mapOrder = (o) => ({
    id: o._id || o.id,
    tableNumber: o.table?.number ?? o.tableNumber ?? "N/A",
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
        
        let simOrders = [];
        try {
            const simStr = await AsyncStorage.getItem("@simulated_orders");
            if (simStr) simOrders = JSON.parse(simStr);
        } catch (e) {
            console.warn("Error reading sim orders:", e);
        }

        try {
            const response = await userClient.get("/orders/me/history");
            const raw = response.data?.data ?? [];
            const mapped = Array.isArray(raw) ? raw.map(mapOrder) : [];
            
            // Combinar órdenes simuladas locales y órdenes del servidor
            const combined = [...simOrders.map(mapOrder), ...mapped];
            setOrders(combined);
        } catch (err) {
            console.warn("Error fetching orders:", err);
            if (simOrders.length > 0) {
                setOrders(simOrders.map(mapOrder));
            } else {
                setError(err.response?.data?.message ?? "Error al cargar las órdenes");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelOrder = useCallback(async (orderId) => {
        if (String(orderId).startsWith("SIM-") || String(orderId).startsWith("ORD-")) {
            try {
                const simStr = await AsyncStorage.getItem("@simulated_orders");
                if (simStr) {
                    let simOrders = JSON.parse(simStr);
                    simOrders = simOrders.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o);
                    await AsyncStorage.setItem("@simulated_orders", JSON.stringify(simOrders));
                }
            } catch (e) {
                console.warn("Error cancelling sim order:", e);
            }
        } else {
            await userClient.put(`/orders/${orderId}/cancel`);
        }
        await fetchOrders();
        return { success: true };
    }, [fetchOrders]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, error, refetch: fetchOrders, cancelOrder };
};
