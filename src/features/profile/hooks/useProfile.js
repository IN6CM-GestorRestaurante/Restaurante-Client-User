// src/features/profile/hooks/useProfile.js
import { useState, useCallback, useEffect } from "react";
import userClient from "../../../shared/api/userClient.js";
import authClient from "../../../shared/api/authClient.js";

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userClient.get("/profile");
            const data = response.data.data ?? response.data;
            setProfile(data);
        } catch (err) {
            console.warn("Error fetching profile:", err);
            // Mock data fallback
            setProfile({
                name: "Usuario Demo",
                email: "demo@restaurante.com",
                phone: "+502 1234 5678",
                favoriteFoods: ["Pizza", "Sushi"],
                username: "demo_user",
            });
            setError("Modo offline: Perfil no sincronizado con el servidor.");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = async (profileData) => {
        setLoading(true);
        try {
            // Nota: Este endpoint debe existir en server-user
            const response = await userClient.put("/profile", profileData);
            setProfile(response.data.data ?? profileData);
            return response.data;
        } catch (err) {
            console.error("Error updating profile:", err);
            // Actualizamos en local si el servidor falla por ahora
            setProfile((prev) => ({ ...prev, ...profileData }));
            throw new Error(err.response?.data?.message ?? "No se pudo actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authClient.post("/logout");
        } catch (err) {
            console.warn("Error en logout en servidor, procediendo localmente...", err);
        }
        // Nota: Aquí usualmente limpiaríamos los tokens de SecureStore o AsyncStorage
        // y el estado global dispararía el cambio de navegación a Auth.
        // Queda preparado para integrar con tu gestor de estado (Zustand/Context).
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile, updateProfile, logout };
};
