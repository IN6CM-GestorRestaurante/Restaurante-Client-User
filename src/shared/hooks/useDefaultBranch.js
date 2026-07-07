// src/shared/hooks/useDefaultBranch.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../api/userClient.js";

// La app todavia asume un unico restaurante activo (la exploracion real de
// varias sucursales es una feature aparte); mientras tanto se usa la primera
// sucursal activa que devuelva el backend como "la" sucursal actual.
export const useDefaultBranch = () => {
    const [branch, setBranch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDefaultBranch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userClient.get("/branches", { params: { limit: 1 } });
            const list = response.data?.data ?? [];
            setBranch(Array.isArray(list) && list.length > 0 ? list[0] : null);
        } catch (err) {
            console.warn("Error fetching default branch:", err);
            setError(err.response?.data?.message || "Error al obtener la sucursal");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDefaultBranch();
    }, [fetchDefaultBranch]);

    return { branch, loading, error, refetch: fetchDefaultBranch };
};
