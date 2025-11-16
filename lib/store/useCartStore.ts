import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../db/schema';

interface CartItem extends Product {
    quantity: number;
    price?: string; // Price from variant
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product & { price?: string }) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) =>
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.id === product.id,
                    );
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item,
                            ),
                        };
                    }
                    return {
                        items: [...state.items, { ...product, quantity: 1 }],
                    };
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                })),
            clearCart: () => set({ items: [] }),
            getTotalPrice: () => {
                const items = get().items;
                return items.reduce(
                    (total, item) =>
                        total +
                        (item.price ? parseFloat(item.price) : 0) *
                            item.quantity,
                    0,
                );
            },
        }),
        {
            name: 'cart-storage',
        },
    ),
);
