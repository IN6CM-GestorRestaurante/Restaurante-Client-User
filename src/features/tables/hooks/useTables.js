// src/features/tables/hooks/useTables.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";

export const useTables = (branchId) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTables = useCallback(async () => {
        if (!branchId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await userClient.get(`/tables/branch/${branchId}`);
            const raw = response.data?.data ?? [];
            const mapped = Array.isArray(raw)
                ? raw.map((t) => ({
                      id: t._id || t.id,
                      number: t.number ?? "N/A",
                      capacity: t.capacity ?? 4,
                      location: t.location ?? "Interior",
                      isAvailable: t.status === "Disponible",
                      status: t.status,
                  }))
                : [];
            setTables(mapped);
        } catch (err) {
            console.warn("Error fetching tables:", err);
            setError(err.response?.data?.message || "Error al cargar las mesas");
            setTables([]);
        } finally {
            setLoading(false);
        }
    }, [branchId]);

    useEffect(() => {
        fetchTables();
    }, [fetchTables]);

    return { tables, loading, error, refetch: fetchTables };
};
