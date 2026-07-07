// src/features/bills/hooks/useBills.js
import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userClient from "../../../shared/api/userClient.js";

const mapBill = (b) => ({
    ...b,
    id: b.invoiceNumber || b._id || b.id,
    orderId: b.orderId ?? b.order?._id ?? "N/A",
    status: (b.status === "COMMITTED" || b.status === "paid") ? "paid" : b.status || "pending",
    total: b.total || b.totalAmount || 0,
    paymentMethod: b.paymentMethod === "CARD" ? "Tarjeta" : b.paymentMethod === "CASH" ? "Efectivo" : b.paymentMethod || "Efectivo",
    paidAt: b.paidAt || b.committedAt || b.createdAt || (b.status === "paid" || b.status === "COMMITTED" ? new Date().toISOString() : null),
});

export const useBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBills = useCallback(async () => {
        setLoading(true);
        setError(null);

        let simBills = [];
        try {
            const simStr = await AsyncStorage.getItem("@simulated_bills");
            if (simStr) simBills = JSON.parse(simStr);
        } catch (e) {
            console.warn("Error reading sim bills:", e);
        }

        try {
            const response = await userClient.get("/bills");
            const rawData = response.data.data?.bills ?? response.data.data ?? response.data;
            const mapped = Array.isArray(rawData) ? rawData.map(mapBill) : [];
            
            // Combinar facturas simuladas locales y facturas del servidor
            const combined = [...simBills.map(mapBill), ...mapped];
            setBills(combined);
        } catch (err) {
            console.warn("Error fetching bills:", err);
            if (simBills.length > 0) {
                setBills(simBills.map(mapBill));
            } else {
                setBills([]);
                setError("No hay facturas registradas.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    return { bills, loading, error, refetch: fetchBills };
};
