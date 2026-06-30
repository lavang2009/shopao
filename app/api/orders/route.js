import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/store.js";
import { requireRole } from "@/lib/auth-server.js";

export async function POST(req) {
  try {
    const body = await req.json();
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }
    const order = await createOrder({
      customerName: body.customerName || "",
      email: body.email || "",
      phone: body.phone || "",
      note: body.note || "",
      items: body.items,
      couponCode: body.couponCode || null
    });
    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Không tạo được đơn" }, { status: 500 });
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  if (url.searchParams.get("admin") === "1") {
    const auth = await requireRole(["admin", "owner"]);
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}
