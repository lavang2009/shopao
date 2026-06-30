import { cookies } from "next/headers";
import { authAdmin, db, hasAdminConfig } from "@/lib/firebase-admin.js";

const COOKIE_NAME = "shopauto_session";

export function adminCookieName() { return COOKIE_NAME; }

export function sessionCookieOptions(maxAgeSeconds = 7 * 24 * 60 * 60) {
  return { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: maxAgeSeconds };
}

export async function createSessionFromIdToken(idToken) {
  const expiresIn = 7 * 24 * 60 * 60 * 1000;
  return await authAdmin().createSessionCookie(idToken, { expiresIn });
}

export async function getViewer() {
  try {
    if (!hasAdminConfig()) return null;
    const session = cookies().get(COOKIE_NAME)?.value;
    if (!session) return null;
    const decoded = await authAdmin().verifySessionCookie(session, true);
    const snap = await db().collection("users").doc(decoded.uid).get();
    const profile = snap.exists ? snap.data() : {};
    return {
      uid: decoded.uid,
      email: decoded.email || profile?.email || null,
      name: decoded.name || profile?.name || profile?.displayName || null,
      photoURL: decoded.picture || profile?.photoURL || null,
      role: profile?.role || "user"
    };
  } catch {
    return null;
  }
}

export async function requireRole(allowed = ["admin", "owner"]) {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, status: 401, message: "Bạn chưa đăng nhập." };
  if (!allowed.includes(viewer.role)) return { ok: false, status: 403, message: "Bạn không có quyền truy cập trang này." };
  return { ok: true, viewer };
}
