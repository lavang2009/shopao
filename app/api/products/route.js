import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-server.js";
import { listPublicProducts, upsertProduct } from "@/lib/store.js";
import { parseList, slugify } from "@/lib/utils.js";

export async function GET() {
  const products = await listPublicProducts();
  return NextResponse.json({ products });
}

export async function POST(req) {
  const auth = await requireRole(["admin", "owner"]);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  try {
    const body = await req.json();
    const product = await upsertProduct({
      title: body.title || "",
      slug: body.slug || slugify(body.title || ""),
      description: body.description || "",
      category: body.category || "Khác",
      price: Number(body.price || 0),
      oldPrice: body.oldPrice ?? null,
      imageUrl: body.imageUrl || "",
      imagePublicId: body.imagePublicId || null,
      fileUrl: body.fileUrl || "",
      filePublicId: body.filePublicId || null,
      featured: Boolean(body.featured),
      visible: body.visible !== false,
      tags: parseList(body.tags)
    });
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Không lưu sản phẩm" }, { status: 500 });
  }
}
