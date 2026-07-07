// src/features/menus/hooks/useMenus.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";

const mapMenuItem = (m) => ({
    id: m._id || m.id,
    name: m.name,
    description: m.description,
    price: m.price,
    category: m.category,
    image: m.image?.startsWith("http") ? m.image : null,
    isAvailable: m.isActive !== false,
    promotion: m.promotion,
});

export const useMenus = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMenus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await userClient.get("/menus", { params: { limit: 100 } });
            const raw = response.data?.data ?? [];
            setMenus(Array.isArray(raw) ? raw.map(mapMenuItem) : []);
        } catch (err) {
            console.warn("Error fetching menus:", err);
            setError(err.response?.data?.message || "Error al cargar el menú");
            setMenus([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    return { menus, loading, error, refetch: fetchMenus };
};
