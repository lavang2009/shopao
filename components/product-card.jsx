"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-provider.jsx";
import { formatMoney } from "@/lib/utils.js";

export function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <article className="card product">
      <Link href={`/product/${product.slug}`} className="thumb">
        <img src={product.imageUrl} alt={product.title} />
      </Link>
      <div className="body">
        <div className="row-between">
          <span className="badge">{product.category}</span>
          {product.featured ? <span className="pill">Nổi bật</span> : null}
        </div>
        <h3 style={{ margin: "12px 0 8px" }}>{product.title}</h3>
        <p className="muted small" style={{ lineHeight: 1.6, minHeight: 48 }}>
          {product.description?.slice(0, 100)}{(product.description || "").length > 100 ? "..." : ""}
        </p>
        <div className="price">
          {formatMoney(product.price)}
          {product.oldPrice ? <span className="price-old">{formatMoney(product.oldPrice)}</span> : null}
        </div>
        <div className="row-between">
          <Link href={`/product/${product.slug}`} className="btn">Xem chi tiết</Link>
          <button className="btn btn-primary" onClick={() => addItem(product)}>Thêm vào giỏ</button>
        </div>
      </div>
    </article>
  );
}
