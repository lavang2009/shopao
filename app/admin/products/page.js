import { redirect } from "next/navigation";
import { AdminProducts } from "@/components/admin-products.jsx";
import { AdminShell } from "@/components/admin-shell.jsx";
import { listAllProducts } from "@/lib/store.js";
import { requireRole } from "@/lib/auth-server.js";

export default async function AdminProductsPage() {
  const auth = await requireRole(["admin", "owner"]);
  if (!auth.ok) redirect("/login");
  const products = await listAllProducts();

  return (
    <AdminShell viewer={auth.viewer} title="Quản lý sản phẩm">
      <AdminProducts initialProducts={products} />
    </AdminShell>
  );
}
