import { notFound, redirect } from "next/navigation";
import { getOrderById } from "@/lib/store.js";
import { getViewer } from "@/lib/auth-server.js";

export default async function DownloadPage({ params, searchParams }) {
  const order = await getOrderById(params.id);
  if (!order) notFound();

  const viewer = await getViewer();
  const token = searchParams?.token || "";
  const allowed = viewer?.role === "admin" || viewer?.role === "owner" || token === order.downloadToken;
  if (!allowed) redirect(`/pay/${order.id}?t=${order.downloadToken}`);

  const canDownload = order.status === "paid" || order.status === "delivered";

  return (
    <div className="card card-pad stack">
      <span className="badge">Đơn #{order.code}</span>
      <h1 style={{ margin: 0 }}>Tải file sau thanh toán</h1>
      {canDownload ? <div className="notice good">Thanh toán đã xác nhận thành công.</div> : <div className="notice bad">Đơn chưa xác nhận thanh toán.</div>}
      <div className="card card-pad">
        <strong>{order.customerName}</strong>
        <div className="small muted">{order.email} • {order.phone}</div>
      </div>
      <div className="stack">
        {order.items.map((item) => (
          <div key={item.productId} className="card card-pad row-between" style={{ padding: 14 }}>
            <div>
              <strong>{item.title}</strong>
              <div className="small muted">Sản phẩm số</div>
            </div>
            {canDownload ? <a className="btn btn-primary" href={item.fileUrl} target="_blank" rel="noreferrer">Tải xuống</a> : <span className="btn">Đang chờ xác nhận</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
