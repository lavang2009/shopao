import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-server.js";
import { deleteCoupon, upsertCoupon } from "@/lib/store.js";

export async function PUT(req, { params }) {
  const auth = await requireRole(["admin", "owner"]);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await req.json();
  const coupon = await upsertCoupon({
    id: params.id,
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

export async function DELETE(_req, { params }) {
  const auth = await requireRole(["admin", "owner"]);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  await deleteCoupon(params.id);
  return NextResponse.json({ ok: true });
}
