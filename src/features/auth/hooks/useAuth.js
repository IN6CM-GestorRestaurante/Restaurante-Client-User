import { useState } from "react";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    const handleLogin = async (data) => {
        try {
            setLoading(true);
            setError(null);
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Datos mock para login
            const mockResponse = {
                accessToken: "mock_access_token_" + Date.now(),
                refreshToken: "mock_refresh_token_" + Date.now(),
                user: {
                    id: "mock_user_1",
                    username: data.emailOrUsername,
                    email: data.emailOrUsername,
                    name: "Usuario",
                    surname: "Demo",
                    phone: "+502 1234 5678",
                    displayName: "Usuario Demo"
                }
            };
            
            await login(mockResponse.accessToken, mockResponse.user, mockResponse.refreshToken);
            return mockResponse;
        } catch (err) {
            setError("Error al iniciar sesión");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (data) => {
        try {
            setLoading(true);
            setError(null);
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Datos mock para registro
            return {
                success: true,
                message: "Registro exitoso"
            };
        } catch (err) {
            setError("Error al registrarse");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, handleRegister, loading, error, logout };
};