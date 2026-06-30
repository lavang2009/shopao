"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-provider.jsx";
import { formatMoney } from "@/lib/utils.js";

export default function CartPage() {
  const { items, subtotal, removeItem, setQty, clear } = useCart();

  if (!items.length) {
    return (
      <div className="card card-pad center">
        <div className="stack">
          <h2>Giỏ hàng trống</h2>
          <p className="muted">Bạn chưa thêm sản phẩm nào.</p>
          <Link href="/" className="btn btn-primary">Quay lại</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="grid-2">
      <div className="card card-pad stack">
        <div className="row-between">
          <h2 style={{ margin: 0 }}>Giỏ hàng</h2>
          <button className="btn" onClick={clear}>Xóa hết</button>
        </div>
        {items.map((item) => (
          <div key={item.productId} className="card card-pad row-between" style={{ padding: 14 }}>
            <div>
              <strong>{item.title}</strong>
              <div className="small muted">Đơn giá: {formatMoney(item.price)}</div>
            </div>
            <div className="row">
              <div className="qty">
                <button className="btn" onClick={() => setQty(item.productId, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button className="btn" onClick={() => setQty(item.productId, item.quantity + 1)}>+</button>
              </div>
              <strong>{formatMoney(item.price * item.quantity)}</strong>
              <button className="btn btn-danger" onClick={() => removeItem(item.productId)}>Xóa</button>
            </div>
          </div>
        ))}
        <Link href="/checkout" className="btn btn-good">Đi tới thanh toán</Link>
      </div>

      <div className="card card-pad">
        <h2>Tóm tắt</h2>
        <div className="row-between"><span>Tạm tính</span><strong>{formatMoney(subtotal)}</strong></div>
        <div className="row-between"><span>Phí thanh toán</span><strong>0đ</strong></div>
        <div className="hr" />
        <div className="row-between"><span>Tổng</span><strong style={{ fontSize: 24 }}>{formatMoney(subtotal)}</strong></div>
      </div>
    </section>
  );
}
