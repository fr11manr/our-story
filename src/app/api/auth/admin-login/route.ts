import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, SESSION_VALUE, SITE_SESSION_COOKIE, cookieOptions, getAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return NextResponse.json({ ok: false, message: "Admin password is not configured" }, { status: 503 });
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json({ ok: false, message: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SITE_SESSION_COOKIE, SESSION_VALUE, cookieOptions());
  response.cookies.set(ADMIN_SESSION_COOKIE, SESSION_VALUE, cookieOptions());
  return response;
}
