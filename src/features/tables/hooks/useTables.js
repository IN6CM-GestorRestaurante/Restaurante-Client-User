// src/features/tables/hooks/useTables.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";

export const useTables = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTables = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Nota: Se asume que el endpoint '/tables' existe, de lo contrario se debe implementar en server-user
            const response = await userClient.get("/tables");
            const raw = response.data.data ?? response.data;
            const mapped = Array.isArray(raw)
                ? raw.map((t) => ({
                      ...t,
                      id: t._id || t.id,
                      number: t.number ?? t.tableNumber ?? "N/A",
                      capacity: t.capacity ?? 4,
                      location: t.location ?? "Interior",
                      isAvailable: Boolean(t.isActive ?? t.isAvailable ?? true),
                  }))
                : [];
            setTables(mapped);
        } catch (err) {
            console.warn("Error fetching tables:", err);
            // Si el endpoint no existe en el backend aún, proveemos datos mock para que la pantalla no se rompa
            setTables([
                { id: "mock1", number: "1", capacity: 2, location: "Terraza", isAvailable: true },
                { id: "mock2", number: "2", capacity: 4, location: "Interior", isAvailable: false },
                { id: "mock3", number: "3", capacity: 6, location: "Salón Principal", isAvailable: true },
            ]);
            setError("Modo offline: Endpoint de mesas no disponible en el servidor.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTables();
    }, [fetchTables]);

    return { tables, loading, error, refetch: fetchTables };
};
