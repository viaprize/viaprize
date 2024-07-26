import { Application } from 'types/gitcoin.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type CartFinalItem = {
  roundId: string;
  chainId: number;
  amount: string;
};
export type CartItem = Application & CartFinalItem;
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isItemInCart: (id: string) => boolean;
  changeAmount: (id: string, amount: number) => void;
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
      changeAmount: (id, amount) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (item.id === id) {
              return { ...item, amount: amount.toString() };
            }
            return item;
          });

          return { ...state, items: newItems };
        });
      },
    }),
    {
      name: 'cart-storage', // unique name
    },
  ),
);
