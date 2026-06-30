"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card.jsx";

export function HomeClient({ products }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => ["all", ...Array.from(new Set(products.map((p) => p.category)))], [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const text = [p.title, p.description, p.category, ...(p.tags || [])].join(" ").toLowerCase();
      return (!q || text.includes(q)) && (category === "all" || p.category === category);
    });
  }, [products, query, category]);

  return (
    <>
      <section className="hero shell">
        <div className="glow-orb orb1" />
        <div className="glow-orb orb2" />
        <div className="glow-orb orb3" />
        <div className="card card-pad">
          <span className="badge">Bán source code / template / tool / APK / IPA / TXT</span>
          <h1 className="hero-title">Shop Auto — website bán hàng số tự động, hiện đại, glass như Apple</h1>
          <p className="hero-sub">
            Trang chủ chỉ hiển thị sản phẩm. Thông tin ngân hàng và mã QR chỉ xuất hiện khi người dùng tạo đơn hàng
            ở bước thanh toán. Admin được ẩn và chỉ mở nếu tài khoản có quyền trong Firebase.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary">Tạo tài khoản</Link>
            <Link href="/login" className="btn">Đăng nhập</Link>
            <Link href="/checkout" className="btn btn-good">Đi thanh toán</Link>
          </div>
        </div>
        <div className="card card-pad stack">
          <div className="card stat"><div className="small muted">Thanh toán</div><div className="n">QR SePay</div></div>
          <div className="card stat"><div className="small muted">Bảo vệ admin</div><div className="n">Firebase Role</div></div>
          <div className="card stat"><div className="small muted">Lưu trữ</div><div className="n">Firestore + Cloudinary</div></div>
        </div>
      </section>

      <div className="section-title">
        <div>
          <h2>Sản phẩm</h2>
          <p>{filtered.length} / {products.length} sản phẩm</p>
        </div>
        <div className="row">
          <input className="input" style={{ minWidth: 260 }} placeholder="Tìm kiếm..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c === "all" ? "Tất cả danh mục" : c}</option>)}
          </select>
        </div>
      </div>

      {filtered.length ? (
        <section className="grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </section>
      ) : (
        <div className="card card-pad notice">Chưa có sản phẩm nào. Chỉ chủ sở hữu / admin mới thêm sản phẩm.</div>
      )}
    </>
  );
}
