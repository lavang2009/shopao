import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard.jsx";
import { AdminShell } from "@/components/admin-shell.jsx";
import { getDashboardStats } from "@/lib/store.js";
import { requireRole } from "@/lib/auth-server.js";

export default async function AdminHomePage() {
  const auth = await requireRole(["admin", "owner"]);
  if (!auth.ok) redirect("/login");
  const stats = await getDashboardStats();

  return (
    <AdminShell viewer={auth.viewer} title="Bảng điều khiển">
      <AdminDashboard stats={stats} />
    </AdminShell>
  );
}
