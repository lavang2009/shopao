"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider.jsx";
import { formatMoney } from "@/lib/utils.js";

export function CheckoutClient() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", note: "" });

  const effectiveTotal = couponInfo?.total ?? subtotal;
  const summary = useMemo(() => items.map((i) => `${i.title} x${i.quantity}`).join(" • "), [items]);

  async function checkCoupon() {
    if (!couponCode.trim()) return setCouponInfo(null);
    const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponCode.trim())}&subtotal=${subtotal}`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setCouponInfo({ discount: 0, total: subtotal });
    setCouponInfo(data);
  }

  async function submit() {
    if (!items.length) return alert("Giỏ hàng trống.");
    if (form.customerName.trim().length < 2) return alert("Nhập họ tên.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return alert("Email không hợp lệ.");
    if (form.phone.trim().length < 8) return alert("Nhập số điện thoại.");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, couponCode: couponCode.trim() || null, items })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tạo được đơn hàng");
      clear();
      router.push(`/pay/${data.order.id}?t=${encodeURIComponent(data.order.downloadToken)}`);
    } catch (e) {
      alert(e.message || "Lỗi tạo đơn");
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="card card-pad center">
        <div className="stack">
          <h2>Giỏ hàng đang trống</h2>
          <p className="muted">Hãy thêm sản phẩm trước khi tạo đơn.</p>
          <a href="/" className="btn btn-primary">Về trang chủ</a>
        </div>
      </div>
    );
  }

  return (
    <section className="grid-2">
      <div className="card card-pad stack">
        <div>
          <div className="badge">Thanh toán</div>
          <h1 style={{ margin: "10px 0 0", fontSize: 34 }}>Tạo đơn và nhận mã QR</h1>
          <p className="muted">Thông tin ngân hàng chỉ hiện ở bước này, không hiển thị ở trang chủ.</p>
        </div>

        <div className="grid-2">
          <input className="input" placeholder="Họ tên" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Mã giảm giá" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} onBlur={checkCoupon} />
        </div>
        <textarea className="textarea" placeholder="Ghi chú đơn hàng" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <div className="row">
          <button className="btn" onClick={checkCoupon}>Áp dụng coupon</button>
          <button className="btn btn-good" disabled={loading} onClick={submit}>{loading ? "Đang tạo..." : `Tạo đơn (${formatMoney(effectiveTotal)})`}</button>
        </div>
        <div className="notice">Nội dung chuyển khoản sẽ là mã đơn hàng. SePay sẽ dùng mã đó để tự xác nhận.</div>
      </div>

      <div className="card card-pad stack">
        <h2 style={{ margin: 0 }}>Tóm tắt</h2>
        <div className="stack">
          {items.map((i) => (
            <div key={i.productId} className="card card-pad" style={{ padding: 14 }}>
              <div className="row-between">
                <strong>{i.title}</strong>
                <span>{formatMoney(i.price * i.quantity)}</span>
              </div>
              <div className="small muted">SL: {i.quantity}</div>
            </div>
          ))}
        </div>
        <div className="hr" />
        <div className="row-between"><span>Tạm tính</span><strong>{formatMoney(subtotal)}</strong></div>
        <div className="row-between"><span>Giảm giá</span><strong>{formatMoney(couponInfo?.discount || 0)}</strong></div>
        <div className="row-between"><span>Tổng thanh toán</span><strong style={{ fontSize: 24 }}>{formatMoney(effectiveTotal)}</strong></div>
        <div className="small muted">{summary}</div>
      </div>
    </section>
  );
}
