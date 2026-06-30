"use client";
import { useState } from "react";
import { formatMoney } from "@/lib/utils.js";

export function AdminOrders({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [busyId, setBusyId] = useState("");

  async function refresh() {
    const res = await fetch("/api/orders?admin=1", { cache: "no-store" });
    const data = await res.json();
    setOrders(data.orders || []);
  }

  async function updateStatus(id, status) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không cập nhật");
      await refresh();
    } catch (e) {
      alert(e.message || "Lỗi");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="grid-2">
      <div className="card card-pad stack">
        <div className="row-between">
          <h2 style={{ margin: 0 }}>Đơn hàng gần đây</h2>
          <button className="btn" onClick={refresh}>Làm mới</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead><tr><th>Mã</th><th>Khách</th><th>Tổng</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.code}</strong><div className="small muted">{o.email}</div></td>
                  <td>{o.customerName}</td>
                  <td>{formatMoney(o.total)}</td>
                  <td>{o.status}</td>
                  <td>
                    <div className="row">
                      <button className="btn btn-good" disabled={busyId === o.id} onClick={() => updateStatus(o.id, "paid")}>Paid</button>
                      <button className="btn" disabled={busyId === o.id} onClick={() => updateStatus(o.id, "delivered")}>Delivered</button>
                      <button className="btn btn-danger" disabled={busyId === o.id} onClick={() => updateStatus(o.id, "cancelled")}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!orders.length ? <tr><td colSpan="5" className="muted">Chưa có đơn hàng.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card card-pad stack">
        <h2 style={{ margin: 0 }}>Coupon</h2>
        <div className="small muted">Tạo coupon trực tiếp trong Firestore hoặc qua API admin.</div>
        <div className="notice small">Trang này chỉ để xem và cập nhật trạng thái đơn. Coupon có thể quản lý ở Firestore hoặc thêm thêm endpoint nếu cần.</div>
      </div>
    </div>
  );
}
