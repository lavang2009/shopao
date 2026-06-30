import "./globals.css";
import Link from "next/link";
import { CartProvider } from "@/components/cart-provider.jsx";
import { CartBadge } from "@/components/cart-badge.jsx";
import { getViewer } from "@/lib/auth-server.js";

export const metadata = {
  title: "Shop Auto Final",
  description: "Website bán hàng số tự động, QR SePay, admin ẩn"
};

export default async function RootLayout({ children }) {
  const viewer = await getViewer();

  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <header className="topbar">
            <div className="topbar-inner">
              <Link href="/" className="brand">
                <span className="brand-badge">SA</span>
                <span>
                  <div>Shop Auto Final</div>
                  <div className="small muted">Glass • Firestore • Cloudinary • SePay</div>
                </span>
              </Link>

              <nav className="nav">
                <Link href="/">Trang chủ</Link>
                <Link href="/checkout">Thanh toán</Link>
                <Link href="/cart">Giỏ hàng</Link>
                {viewer ? <Link href="/api/auth/logout">Đăng xuất</Link> : <Link href="/login">Đăng nhập</Link>}
                {(viewer?.role === "admin" || viewer?.role === "owner") ? <Link href="/admin">Admin</Link> : null}
              </nav>

              <CartBadge />
            </div>
          </header>

          <main>{children}</main>

          <footer className="footer small">
            QR chỉ xuất hiện sau khi tạo đơn. Trang admin chỉ mở khi role Firebase hợp lệ.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
