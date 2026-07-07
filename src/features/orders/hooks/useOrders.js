// src/features/orders/hooks/useOrders.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userClient.get("/orders");
            // Soporta respuesta paginada ({ data: { orders: [...] } }) o lista directa
            const rawData = response.data.data?.orders ?? response.data.data ?? response.data;
            
            const mapped = Array.isArray(rawData)
                ? rawData.map((o) => ({
                      ...o,
                      id: o._id || o.id,
                      tableNumber: o.table?.number ?? o.table ?? "N/A",
                      status: o.status || "pending",
                      total: o.total || 0,
                      createdAt: o.createdAt || new Date().toISOString(),
                  }))
                : [];
            setOrders(mapped);
        } catch (err) {
            console.warn("Error fetching orders:", err);
            setError(err.response?.data?.message ?? "Error al cargar las órdenes");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, error, refetch: fetchOrders };
};
