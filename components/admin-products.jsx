"use client";

import { useMemo, useState } from "react";
import { slugify, formatMoney } from "@/lib/utils.js";
import { uploadToCloudinary } from "@/lib/cloudinary.js";

const empty = { id: "", title: "", slug: "", description: "", category: "Source Code", price: "", oldPrice: "", imageUrl: "", fileUrl: "", featured: false, visible: true, tags: "" };

export function AdminProducts({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [draft, setDraft] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => [p.title, p.slug, p.category, p.description].join(" ").toLowerCase().includes(q));
  }, [products, filter]);

  async function refresh() {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(data.products || []);
  }

  function edit(p) {
    setDraft({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      category: p.category,
      price: String(p.price || ""),
      oldPrice: String(p.oldPrice || ""),
      imageUrl: p.imageUrl || "",
      fileUrl: p.fileUrl || "",
      featured: Boolean(p.featured),
      visible: p.visible !== false,
      tags: (p.tags || []).join(", ")
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    if (!draft.title || !draft.slug || !draft.imageUrl || !draft.fileUrl) {
      alert("Thiếu tên, slug, ảnh hoặc file.");
      return;
    }
    setBusy(true);
    try {
      const body = {
        ...draft,
        price: Number(draft.price || 0),
        oldPrice: draft.oldPrice ? Number(draft.oldPrice) : null,
        tags: draft.tags.split(",").map((s) => s.trim()).filter(Boolean)
      };
      const res = await fetch(draft.id ? `/api/products/${draft.id}` : "/api/products", {
        method: draft.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không lưu được sản phẩm");
      setDraft(empty);
      await refresh();
    } catch (e) {
      alert(e.message || "Lỗi lưu sản phẩm");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm("Xóa sản phẩm này?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function onImageUpload(file) {
    const up = await uploadToCloudinary(file, "image");
    setDraft((d) => ({ ...d, imageUrl: up.secure_url, imagePublicId: up.public_id }));
  }

  async function onFileUpload(file) {
    const up = await uploadToCloudinary(file, "raw");
    setDraft((d) => ({ ...d, fileUrl: up.secure_url, filePublicId: up.public_id }));
  }

  return (
    <div className="grid-2">
      <div className="card card-pad stack">
        <div className="row-between">
          <h2 style={{ margin: 0 }}>{draft.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
          <button className="btn" onClick={() => setDraft(empty)}>Làm mới</button>
        </div>
        <div className="grid-2">
          <input className="input" placeholder="Tên sản phẩm" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.slug || slugify(e.target.value) })} />
          <input className="input" placeholder="Slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          <input className="input" placeholder="Danh mục" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
          <input className="input" placeholder="Tags: a, b, c" value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} />
          <input className="input" placeholder="Giá" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
          <input className="input" placeholder="Giá gốc" value={draft.oldPrice} onChange={(e) => setDraft({ ...draft, oldPrice: e.target.value })} />
        </div>
        <textarea className="textarea" placeholder="Mô tả" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        <div className="row">
          <label className="chip"><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /> Nổi bật</label>
          <label className="chip"><input type="checkbox" checked={draft.visible} onChange={(e) => setDraft({ ...draft, visible: e.target.checked })} /> Hiển thị</label>
        </div>
        <div className="notice small">Upload ảnh và file bằng Cloudinary unsigned preset. Không dùng storage lộ link thật trên main page.</div>
        <input className="input" type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await onImageUpload(f); }} />
        <input className="input" type="file" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await onFileUpload(f); }} />
        <div className="preview">
          <img src={draft.imageUrl || "https://via.placeholder.com/300x300?text=Preview"} alt="preview" />
          <div className="stack">
            <div className="small muted">Ảnh: {draft.imageUrl || "Chưa có"}</div>
            <div className="small muted">File: {draft.fileUrl || "Chưa có"}</div>
            <div className="small muted">Giá: {formatMoney(Number(draft.price || 0))}</div>
          </div>
        </div>
        <button className="btn btn-primary" disabled={busy} onClick={save}>{busy ? "Đang lưu..." : "Lưu sản phẩm"}</button>
      </div>

      <div className="card card-pad stack">
        <div className="row-between">
          <h2 style={{ margin: 0 }}>Danh sách sản phẩm</h2>
          <input className="input" style={{ maxWidth: 260 }} placeholder="Tìm..." value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead><tr><th>Tên</th><th>Giá</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong><div className="small muted">{p.slug}</div></td>
                  <td>{formatMoney(p.price)}</td>
                  <td>{p.visible ? "Hiện" : "Ẩn"}</td>
                  <td>
                    <div className="row">
                      <button className="btn" onClick={() => edit(p)}>Sửa</button>
                      <button className="btn btn-danger" onClick={() => remove(p.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length ? <tr><td colSpan="4" className="muted">Chưa có sản phẩm.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
