import Link from "next/link";

export function AdminShell({ viewer, title, children }) {
  return (
    <div className="stack">
      <div className="row-between">
        <div>
          <div className="badge">Quản trị</div>
          <h1 style={{ margin: "10px 0 0", fontSize: 34 }}>{title}</h1>
          <p className="muted" style={{ margin: "8px 0 0" }}>
            Chỉ tài khoản có role <strong>admin</strong> hoặc <strong>owner</strong> trong Firebase mới thấy trang này.
          </p>
        </div>
        <div className="row">
          <span className="pill">{viewer?.email || "No account"}</span>
          <Link className="btn" href="/api/auth/logout">Đăng xuất</Link>
        </div>
      </div>
      <div className="grid-3">
        <Link className="card card-pad" href="/admin">Dashboard</Link>
        <Link className="card card-pad" href="/admin/products">Products</Link>
        <Link className="card card-pad" href="/admin/orders">Orders & Coupons</Link>
      </div>
      {children}
    </div>
  );
}
