"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-provider.jsx";

export function CartBadge() {
  const { count } = useCart();
  return <Link href="/cart" className="cart-pill">🛒 Giỏ hàng <strong>{count}</strong></Link>;
}
