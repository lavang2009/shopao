import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth-server.js";

export async function GET() {
  const viewer = await getViewer();
  return NextResponse.json({ viewer });
}
