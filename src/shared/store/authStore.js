// src/shared/store/authStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Omitimos normalizeAuthUser y resolveExpiresAt ya que probablemente no existan en Restaurante
const REFRESH_TOKEN_KEY = "ks_refresh_token";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        if (refreshToken) {
          if (Platform.OS === 'web') {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
          } else {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
          }
        }
        set({
          token: accessToken,
          user,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        if (Platform.OS === 'web') {
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        } else {
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setAccessToken: (token) => set({ token }),
      updateUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;
