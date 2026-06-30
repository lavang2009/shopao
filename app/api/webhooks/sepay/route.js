import { NextResponse } from "next/server";
import { markOrderPaidByCode } from "@/lib/store.js";

function extractStrings(value, out = []) {
  if (!value) return out;
  if (typeof value === "string") { out.push(value); return out; }
  if (Array.isArray(value)) { for (const item of value) extractStrings(item, out); return out; }
  if (typeof value === "object") { for (const v of Object.values(value)) extractStrings(v, out); }
  return out;
}

export async function POST(req) {
  try {
    const secret = process.env.SEPAY_WEBHOOK_SECRET;
    if (secret) {
      const header = req.headers.get("x-webhook-secret") || req.headers.get("x-sepay-secret") || "";
      if (header !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json().catch(() => ({}));
    const strings = extractStrings(payload);
    const code = strings.find((s) => /OD-[A-Z0-9-]+/i.test(s))?.match(/OD-[A-Z0-9-]+/i)?.[0]?.toUpperCase();
    if (!code) return NextResponse.json({ ok: true, matched: false, reason: "no order code" });

    const order = await markOrderPaidByCode(code, payload);
    if (!order) return NextResponse.json({ ok: true, matched: false, reason: "order not found" });
    return NextResponse.json({ ok: true, matched: true, orderId: order.id });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Webhook error" }, { status: 500 });
  }
}
