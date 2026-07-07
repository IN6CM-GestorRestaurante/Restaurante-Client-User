// src/features/menus/store/cartStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            branchId: null,

            addItem: (item, branchId) => {
                const currentBranchId = get().branchId;
                let currentItems = [...get().items];

                // Si se agrega de un restaurante distinto, reiniciar el carrito
                if (currentBranchId && currentBranchId !== branchId && currentItems.length > 0) {
                    currentItems = [];
                }

                const existingIndex = currentItems.findIndex((i) => i.id === item.id);
                if (existingIndex > -1) {
                    currentItems[existingIndex].quantity += 1;
                } else {
                    currentItems.push({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        category: item.category,
                        quantity: 1,
                    });
                }

                set({ items: currentItems, branchId: branchId });
            },

            removeItem: (itemId) => {
                const updatedItems = get().items.filter((i) => i.id !== itemId);
                set({
                    items: updatedItems,
                    branchId: updatedItems.length === 0 ? null : get().branchId,
                });
            },

            updateQuantity: (itemId, delta) => {
                const currentItems = [...get().items];
                const index = currentItems.findIndex((i) => i.id === itemId);
                if (index > -1) {
                    const newQty = currentItems[index].quantity + delta;
                    if (newQty <= 0) {
                        currentItems.splice(index, 1);
                    } else {
                        currentItems[index].quantity = newQty;
                    }
                }
                set({
                    items: currentItems,
                    branchId: currentItems.length === 0 ? null : get().branchId,
                });
            },

            clearCart: () => set({ items: [], branchId: null }),

            getTotal: () => {
                return get().items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
            },

            getItemCount: () => {
                return get().items.reduce((acc, item) => acc + (item.quantity || 0), 0);
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
