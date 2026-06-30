import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-server.js";
import { applyCouponToAmount, getCouponByCode, listCoupons, upsertCoupon } from "@/lib/store.js";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (code) {
    const subtotal = Number(url.searchParams.get("subtotal") || 0);
    const coupon = await getCouponByCode(code);
    if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const discount = applyCouponToAmount(coupon, subtotal);
    return NextResponse.json({ coupon, discount, total: Math.max(0, subtotal - discount) });
  }
  const coupons = await listCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(req) {
  const auth = await requireRole(["admin", "owner"]);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await req.json();
  const coupon = await upsertCoupon({
    code: body.code || "",
    type: body.type === "fixed" ? "fixed" : "percent",
    value: Number(body.value || 0),
    active: body.active !== false,
    maxUses: body.maxUses ?? null,
    usedCount: Number(body.usedCount || 0),
    expiresAt: body.expiresAt || null
  });
  return NextResponse.json({ coupon });
}
