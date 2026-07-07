// src/features/bills/hooks/useBills.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";

export const useBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBills = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Nota: Se asume que el endpoint '/bills' existe, o se simula si falla
            const response = await userClient.get("/bills");
            const rawData = response.data.data?.bills ?? response.data.data ?? response.data;
            
            const mapped = Array.isArray(rawData)
                ? rawData.map((b) => ({
                      ...b,
                      id: b._id || b.id,
                      orderId: b.orderId ?? b.order?._id ?? "N/A",
                      status: b.status || "pending",
                      total: b.total || 0,
                      paymentMethod: b.paymentMethod || "Efectivo",
                      paidAt: b.paidAt || (b.status === "paid" ? new Date().toISOString() : null),
                  }))
                : [];
            setBills(mapped);
        } catch (err) {
            console.warn("Error fetching bills:", err);
            // Mock de facturas para que la UI funcione si el backend aún no tiene el endpoint
            setBills([
                { id: "F-001", orderId: "1", status: "paid", total: 150.50, paymentMethod: "Tarjeta", paidAt: new Date().toISOString() },
                { id: "F-002", orderId: "2", status: "pending", total: 45.00, paymentMethod: "Efectivo", paidAt: null }
            ]);
            setError("Modo offline: Endpoint de facturas no disponible en el servidor.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    return { bills, loading, error, refetch: fetchBills };
};
