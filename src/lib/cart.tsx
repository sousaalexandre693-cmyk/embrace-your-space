import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "./pricing";

type Ctx = {
  items: CartItem[];
  coupon: string | null;
  add: (item: CartItem) => void;
  remove: (serviceId: string) => void;
  setQty: (serviceId: string, qty: number) => void;
  has: (serviceId: string) => boolean;
  setCoupon: (c: string | null) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "autopro-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setItems(d.items ?? []);
        setCoupon(d.coupon ?? null);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify({ items, coupon }));
  }, [items, coupon, ready]);

  const value: Ctx = {
    items,
    coupon,
    add: (item) =>
      setItems((cur) => {
        const rest = cur.filter((i) => i.serviceId !== item.serviceId);
        return [...rest, item];
      }),
    remove: (id) => setItems((cur) => cur.filter((i) => i.serviceId !== id)),
    setQty: (id, qty) => setItems((cur) => cur.map((i) => (i.serviceId === id ? { ...i, qty: Math.max(1, qty) } : i))),
    has: (id) => items.some((i) => i.serviceId === id),
    setCoupon,
    clear: () => setItems([]),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
