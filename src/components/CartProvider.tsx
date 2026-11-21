"use client";
/**
 * CARRITO DE COMPRAS
 * Guarda los productos elegidos en el navegador del visitante (localStorage),
 * así no se pierden si recarga la página.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { slug: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "indumen2k-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Al abrir la página: recuperar el carrito guardado
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Si el navegador no deja guardar (modo incógnito, etc.), seguimos sin guardar
    }
    setLoaded(true);
  }, []);

  // Cada vez que cambia el carrito: guardarlo
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value: CartContextValue = {
    items,
    count: items.reduce((sum, i) => sum + i.qty, 0),
    add: (slug) =>
      setItems((prev) => {
        const found = prev.find((i) => i.slug === slug);
        if (found) return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i));
        return [...prev, { slug, qty: 1 }];
      }),
    setQty: (slug, qty) =>
      setItems((prev) =>
        prev.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(qty, 10)) } : i)),
      ),
    remove: (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug)),
    clear: () => setItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart tiene que usarse dentro de <CartProvider>");
  return ctx;
}
