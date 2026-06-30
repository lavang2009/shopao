"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function OrderStatusClient({ orderId, token, paid, downloadHref }) {
  const [status, setStatus] = useState(paid ? "paid" : "pending");

  useEffect(() => {
    if (paid) return;
    let alive = true;
    const tick = async () => {
      const res = await fetch(`/api/orders/${orderId}?token=${encodeURIComponent(token)}`, { cache: "no-store" });
      if (!res.ok || !alive) return;
      const data = await res.json();
      setStatus(data.order?.status || "pending");
      if (data.order?.status === "paid") window.location.href = downloadHref;
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => { alive = false; clearInterval(id); };
  }, [orderId, token, paid, downloadHref]);

  return (
    <div className={`notice ${status === "paid" ? "good" : ""}`}>
      <div className="row-between">
        <strong>Trạng thái: {status.toUpperCase()}</strong>
        <Link href={downloadHref} className="btn btn-primary">Mở trang tải</Link>
      </div>
    </div>
  );
}
