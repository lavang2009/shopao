import { AuthShell } from "@/components/auth-shell.jsx";
import { LoginForm } from "@/components/login-form.jsx";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthShell title="Đăng nhập" subtitle="Đăng nhập bằng email, Google, hoặc Apple/iCloud">
      <LoginForm />
      <div className="small muted">Chưa có tài khoản? <Link href="/register">Đăng ký</Link></div>
    </AuthShell>
  );
}
