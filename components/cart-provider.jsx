"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "shopauto_cart_v1";

function loadCart() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveCart(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => setItems(loadCart()), []);
  useEffect(() => saveCart(items), [items]);

  const value = useMemo(() => {
    const addItem = (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((x) => x.productId === product.id);
        if (existing) return prev.map((x) => x.productId === product.id ? { ...x, quantity: x.quantity + quantity } : x);
        return prev.concat({
          productId: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
          fileUrl: product.fileUrl
        });
      });
    };
    const removeItem = (productId) => setItems((prev) => prev.filter((x) => x.productId !== productId));
    const setQty = (productId, quantity) => setItems((prev) => prev.map((x) => x.productId === productId ? { ...x, quantity: Math.max(1, quantity) } : x));
    const clear = () => setItems([]);

    return {
      items,
      addItem,
      removeItem,
      setQty,
      clear,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
