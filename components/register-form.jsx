"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseAuth, googleProvider, appleProvider } from "@/lib/firebase-client.js";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";

async function syncSession() {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Chưa đăng nhập.");
  const idToken = await user.getIdToken(true);
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Không tạo được session.");
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function withProvider(provider) {
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, provider);
      await syncSession();
      router.push("/");
      router.refresh();
    } catch (e) {
      alert(e.message || "Đăng ký thất bại");
    } finally {
      setBusy(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (password.length < 6) return alert("Mật khẩu tối thiểu 6 ký tự.");
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
      await syncSession();
      router.push("/");
      router.refresh();
    } catch (e) {
      alert(e.message || "Đăng ký thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      <input className="input" placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input" placeholder="Mật khẩu (>= 6 ký tự)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary" disabled={busy}>{busy ? "Đang tạo tài khoản..." : "Đăng ký email"}</button>
      <div className="row">
        <button type="button" className="btn" onClick={() => withProvider(googleProvider)} disabled={busy}>Google</button>
        <button type="button" className="btn" onClick={() => withProvider(appleProvider)} disabled={busy}>Apple / iCloud</button>
      </div>
    </form>
  );
}
