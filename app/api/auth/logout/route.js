import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth-server.js";

export async function GET() {
  const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  res.cookies.set(adminCookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
