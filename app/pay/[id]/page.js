import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { getBankConfig, vietqrUrl } from "@/lib/bank.js";
import { getOrderById } from "@/lib/store.js";
import { OrderStatusClient } from "@/components/order-status-client.jsx";
import { formatMoney } from "@/lib/utils.js";
import { getViewer } from "@/lib/auth-server.js";

export default async function PayPage({ params, searchParams }) {
  const order = await getOrderById(params.id);
  if (!order) notFound();

  const viewer = await getViewer();
  const token = searchParams?.t || "";
  const allowed = viewer?.role === "admin" || viewer?.role === "owner" || token === order.downloadToken;
  if (!allowed) notFound();

  const bank = getBankConfig();
  const qr = vietqrUrl(order.total, order.code);
  await QRCode.toDataURL(`${bank.bankName}|${bank.accountNumber}|${bank.accountHolder}|${order.total}|${order.code}`, { width: 420, margin: 1 });

  return (
    <section className="grid-2">
      <div className="card card-pad stack">
        <span className="badge">Đơn #{order.code}</span>
        <h1 style={{ margin: 0, fontSize: 34 }}>Thanh toán QR</h1>
        <div className="notice">
          Chuyển khoản đúng <strong>{formatMoney(order.total)}</strong> và ghi nội dung <strong>{order.code}</strong>
        </div>
        <img src={qr} alt="QR VietQR" style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,.08)" }} />
        <div className="card card-pad">
          <div className="row-between"><span>Ngân hàng</span><strong>{bank.bankName}</strong></div>
          <div className="row-between"><span>Số tài khoản</span><strong>{bank.accountNumber}</strong></div>
          <div className="row-between"><span>Chủ tài khoản</span><strong>{bank.accountHolder}</strong></div>
          <div className="row-between"><span>Số tiền</span><strong>{formatMoney(order.total)}</strong></div>
          <div className="row-between"><span>Nội dung</span><strong>{order.code}</strong></div>
        </div>
      </div>

      <div className="card card-pad stack">
        <h2>Thông tin đơn</h2>
        <div className="small muted">Khách: {order.customerName}</div>
        <div className="small muted">Email: {order.email}</div>
        <div className="small muted">SĐT: {order.phone}</div>
        <div className="hr" />
        <OrderStatusClient
          orderId={order.id}
          token={order.downloadToken}
          paid={order.status === "paid" || order.status === "delivered"}
          downloadHref={`/download/${order.id}?token=${order.downloadToken}`}
        />
        <div className="stack">
          {order.items.map((item) => (
            <div key={item.productId} className="card card-pad row-between" style={{ padding: 14 }}>
              <div>
                <strong>{item.title}</strong>
                <div className="small muted">SL: {item.quantity}</div>
              </div>
              <div>{formatMoney(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
