import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  imageURL: string;
  title: string;
  by: string;
  description: string;
  raised: number;
  contributors: number;
  link: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isItemInCart: (id: string) => boolean;
}

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (!state.items.some((cartItem) => cartItem.id === item.id)) {
            return { items: [...state.items, item] };
          }
          return state;
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set(() => ({ items: [] })),
      isItemInCart: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: 'cart-storage', // unique name
    },
  ),
);
