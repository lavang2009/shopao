import { AuthShell } from "@/components/auth-shell.jsx";
import { RegisterForm } from "@/components/register-form.jsx";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <AuthShell title="Đăng ký" subtitle="Mật khẩu tối thiểu 6 ký tự. Hỗ trợ email, Google và Apple/iCloud">
      <RegisterForm />
      <div className="small muted">Đã có tài khoản? <Link href="/login">Đăng nhập</Link></div>
    </AuthShell>
  );
}
