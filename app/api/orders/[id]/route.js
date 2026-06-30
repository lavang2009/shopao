import { NextResponse } from "next/server";
import { getViewer, requireRole } from "@/lib/auth-server.js";
import { getOrderById, updateOrder } from "@/lib/store.js";

export async function GET(req, { params }) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const order = await getOrderById(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const viewer = await getViewer();
  const allowed = viewer?.role === "admin" || viewer?.role === "owner" || token === order.downloadToken;
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ order });
}

export async function PATCH(req, { params }) {
  const auth = await requireRole(["admin", "owner"]);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const body = await req.json();
  const order = await updateOrder(params.id, { status: body.status });
  return NextResponse.json({ order });
}
