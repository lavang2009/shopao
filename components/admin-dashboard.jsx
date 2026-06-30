import Link from "next/link";
import { formatMoney } from "@/lib/utils.js";

export function AdminDashboard({ stats }) {
  return (
    <div className="grid-3">
      <div className="card card-pad stat"><div className="small muted">Sản phẩm</div><div className="n">{stats.products}</div></div>
      <div className="card card-pad stat"><div className="small muted">Đơn hàng</div><div className="n">{stats.orders}</div></div>
      <div className="card card-pad stat"><div className="small muted">Doanh thu</div><div className="n">{formatMoney(stats.revenue)}</div></div>
      <div className="card card-pad"><h3 style={{ marginTop: 0 }}>Quản lý</h3><div className="stack"><Link className="btn" href="/admin/products">Thêm / sửa sản phẩm</Link><Link className="btn" href="/admin/orders">Đơn hàng & coupon</Link></div></div>
      <div className="card card-pad"><h3 style={{ marginTop: 0 }}>Thanh toán</h3><div className="small muted">SePay webhook: /api/webhooks/sepay</div><div className="small muted">QR chỉ xuất hiện ở trang thanh toán sau tạo đơn.</div></div>
      <div className="card card-pad"><h3 style={{ marginTop: 0 }}>Phân quyền</h3><div className="small muted">Role lấy từ Firestore users/{'{uid}'}. Chỉ owner/admin mới vào được.</div></div>
    </div>
  );
}
