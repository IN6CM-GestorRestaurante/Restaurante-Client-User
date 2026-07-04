// src/features/menus/hooks/useMenus.js
import { useState, useCallback, useEffect } from "react";

const MOCK_MENUS = [
    { id: 1, name: "Hamburguesa Clásica", description: "Carne de res, queso cheddar, lechuga y tomate", price: 8.50, category: "Platos Fuertes", image: null },
    { id: 2, name: "Pizza Margarita", description: "Salsa de tomate casera, mozzarella fresca y albahaca", price: 12.00, category: "Platos Fuertes", image: null },
    { id: 3, name: "Ensalada César", description: "Lechuga romana, crotones, parmesano y aderezo", price: 6.50, category: "Entradas", image: null },
    { id: 4, name: "Limonada con Menta", description: "Refrescante limonada natural con hojas de menta", price: 3.00, category: "Bebidas", image: null },
    { id: 5, name: "Pastel de Chocolate", description: "Rebanada de pastel de chocolate oscuro con nueces", price: 4.50, category: "Postres", image: null },
];

export const useMenus = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMenus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Datos mock
            setMenus(MOCK_MENUS);
        } catch (err) {
            setError("Error al cargar menús");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    return { menus, loading, error, refetch: fetchMenus };
};
