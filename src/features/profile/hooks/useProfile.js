// src/features/profile/hooks/useProfile.js
import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import userClient from "../../../shared/api/userClient.js";
import authClient from "../../../shared/api/authClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

const REFRESH_TOKEN_KEY = "ks_refresh_token";

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
            const refreshToken = Platform.OS === "web"
                ? localStorage.getItem(REFRESH_TOKEN_KEY)
                : await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            if (refreshToken) {
                await authClient.post("/logout", { refreshToken });
            }
        } catch (err) {
            console.warn("Error en logout en servidor, procediendo localmente...", err);
        }
        // Limpia el token/usuario del estado global y del almacenamiento seguro,
        // lo que dispara el cambio de navegación de vuelta a AuthStack.
        await useAuthStore.getState().logout();
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile, updateProfile, logout };
};
