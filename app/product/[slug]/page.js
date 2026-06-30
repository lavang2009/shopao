import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/store.js";
import { ProductDetailClient } from "@/components/product-detail-client.jsx";

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
