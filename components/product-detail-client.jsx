"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider.jsx";
import { formatMoney } from "@/lib/utils.js";

export function ProductDetailClient({ product }) {
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <section className="grid-2">
      <div className="card product">
        <div className="thumb" style={{ aspectRatio: "1.15/1" }}>
          <img src={product.imageUrl} alt={product.title} />
        </div>
      </div>

      <div className="card card-pad stack">
        <span className="badge">{product.category}</span>
        <h1 style={{ margin: 0, fontSize: 34 }}>{product.title}</h1>
        <div className="price">
          {formatMoney(product.price)}
          {product.oldPrice ? <span className="price-old">{formatMoney(product.oldPrice)}</span> : null}
        </div>
        <p className="muted" style={{ lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{product.description}</p>
        {product.tags?.length ? <div className="row">{product.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div> : null}
        <div className="row">
          <button className="btn btn-primary" onClick={() => addItem(product)}>Thêm vào giỏ</button>
          <button className="btn btn-good" onClick={() => { addItem(product); router.push("/checkout"); }}>Mua ngay</button>
          <Link href="/cart" className="btn">Xem giỏ hàng</Link>
        </div>
        <div className="notice">Thông tin tải file chỉ mở sau khi đơn đã được xác nhận thanh toán.</div>
      </div>
    </section>
  );
}
