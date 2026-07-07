import { useState } from "react";
import { useAuthStore } from "../../../shared/store/authStore.js";
import authClient from "../../../shared/api/authClient.js";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    const handleLogin = async (data) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authClient.post('/login', data);
            const { accessToken, refreshToken, userDetails } = response.data;
            
            await login(accessToken, userDetails, refreshToken);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al iniciar sesión");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (data) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authClient.post('/register', data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrarse");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (token) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authClient.post('/verify-email', { token });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Código inválido o expirado");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, handleRegister, handleVerifyEmail, loading, error, logout };
};