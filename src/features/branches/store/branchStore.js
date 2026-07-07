// src/features/branches/store/branchStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userClient from "../../../shared/api/userClient.js";

export const useBranchStore = create(
    persist(
        (set, get) => ({
            selectedBranch: null,
            branches: [],
            loading: false,
            error: null,

            setSelectedBranch: (branch) => set({ selectedBranch: branch }),

            fetchBranches: async (search = "") => {
                set({ loading: true, error: null });
                try {
                    const response = await userClient.get("/branches", {
                        params: { limit: 50 },
                    });
                    let list = response.data?.data ?? [];
                    if (search.trim()) {
                        const q = search.trim().toLowerCase();
                        list = list.filter(
                            (b) =>
                                b.name?.toLowerCase().includes(q) ||
                                b.category?.toLowerCase().includes(q) ||
                                b.address?.toLowerCase().includes(q)
                        );
                    }
                    set({ branches: list });

                    // Si no hay sucursal seleccionada todavia, preseleccionar la primera
                    if (!get().selectedBranch && list.length > 0) {
                        set({ selectedBranch: list[0] });
                    }
                    return list;
                } catch (err) {
                    console.warn("Error fetching branches:", err);
                    set({ error: err.response?.data?.message || "Error al obtener sucursales" });
                    return [];
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "branch-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ selectedBranch: state.selectedBranch }),
        }
    )
);
