import { NextResponse } from "next/server";
import { adminCookieName, createSessionFromIdToken, sessionCookieOptions } from "@/lib/auth-server.js";
import { upsertUserProfile } from "@/lib/store.js";
import { authAdmin } from "@/lib/firebase-admin.js";

export async function POST(req) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Thiếu idToken" }, { status: 400 });

    const decoded = await authAdmin().verifyIdToken(idToken, true);
    const sessionCookie = await createSessionFromIdToken(idToken);
    const userRecord = await authAdmin().getUser(decoded.uid);

    await upsertUserProfile({
      uid: decoded.uid,
      email: userRecord.email || decoded.email || null,
      name: userRecord.displayName || decoded.name || null,
      photoURL: userRecord.photoURL || decoded.picture || null
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(adminCookieName(), sessionCookie, sessionCookieOptions());
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message || "Không tạo được session" }, { status: 401 });
  }
}
