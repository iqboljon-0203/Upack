import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  minOrderQuantity?: number;
  step?: number;
}

interface CartStore {
  items: CartItem[];
  cartLimits: { globalLimit: number; productLimits: Record<string, number> };
  fetchCartLimits: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartLimits: { globalLimit: 100, productLimits: {} },
      fetchCartLimits: async () => {
        try {
          const res = await fetch('/api/content');
          const json = await res.json();
          if (json && json.cart_limits) {
            set({
              cartLimits: {
                globalLimit: json.cart_limits.globalLimit || 100,
                productLimits: json.cart_limits.productLimits || {}
              }
            });
          }
        } catch (e) {
          console.error("Error fetching cart limits:", e);
        }
      },
      addItem: (newItem) => {
        const limits = get().cartLimits || { globalLimit: 100, productLimits: {} };
        const limit = limits.productLimits[newItem.id] !== undefined ? limits.productLimits[newItem.id] : limits.globalLimit;

        set((state) => {
          const existingItem = state.items.find(item => item.id === newItem.id);
          const addedQty = newItem.quantity || newItem.minOrderQuantity || newItem.step || 1;
          const currentQty = existingItem ? existingItem.quantity : 0;
          const newQty = currentQty + addedQty;

          if (newQty > limit) {
            import('sonner').then(({ toast }) => {
              toast.warning(
                `Maksimal buyurtma miqdori: ${limit} ta. Hozirda savatda ${currentQty} ta bor.`
              );
            });

            if (existingItem) {
              return {
                items: state.items.map(item =>
                  item.id === newItem.id ? { ...item, quantity: limit } : item
                )
              };
            }
            return { items: [...state.items, { ...newItem, quantity: limit }] };
          }

          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === newItem.id ? { ...item, quantity: newQty } : item
              )
            };
          }
          return { items: [...state.items, { ...newItem, quantity: addedQty }] };
        });
      },
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => {
        const limits = get().cartLimits || { globalLimit: 100, productLimits: {} };
        const limit = limits.productLimits[id] !== undefined ? limits.productLimits[id] : limits.globalLimit;

        if (quantity > limit) {
          import('sonner').then(({ toast }) => {
            toast.warning(`Ushbu mahsulot uchun maksimal buyurtma miqdori: ${limit} ta`);
          });
          quantity = limit;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'upack-cart-storage',
      // only persist items in localStorage, not cartLimits or fetch function
      partialize: (state) => ({ items: state.items }),
    }
  )
);
