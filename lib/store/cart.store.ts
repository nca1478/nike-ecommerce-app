import { create } from 'zustand';

export type CartItemType = {
    id: string;
    productVariantId: string;
    quantity: number;
    productName: string;
    productImage: string;
    price: number;
    salePrice?: number;
    size: string;
    color: string;
    category: string;
    estimatedDelivery?: string;
};

type CartStore = {
    items: CartItemType[];
    isLoading: boolean;
    setItems: (items: CartItemType[]) => void;
    addItem: (item: CartItemType) => void;
    updateItem: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    setLoading: (loading: boolean) => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isLoading: false,

    setItems: (items) => set({ items }),

    addItem: (item) =>
        set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i,
                    ),
                };
            }
            return { items: [...state.items, item] };
        }),

    updateItem: (id, quantity) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item,
            ),
        })),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        })),

    clearCart: () => set({ items: [] }),

    setLoading: (loading) => set({ isLoading: loading }),

    getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
    },

    getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
            const price = item.salePrice ?? item.price;
            return total + price * item.quantity;
        }, 0);
    },
}));
