import { redirect } from "next/navigation";
import { AdminOrders } from "@/components/admin-orders.jsx";
import { AdminShell } from "@/components/admin-shell.jsx";
import { listOrders } from "@/lib/store.js";
import { requireRole } from "@/lib/auth-server.js";

export default async function AdminOrdersPage() {
  const auth = await requireRole(["admin", "owner"]);
  if (!auth.ok) redirect("/login");
  const orders = await listOrders();

  return (
    <AdminShell viewer={auth.viewer} title="Đơn hàng & coupon">
      <AdminOrders initialOrders={orders} />
    </AdminShell>
  );
}
