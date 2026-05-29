import { NextResponse } from "next/server";
import { SESSION_VALUE, SITE_SESSION_COOKIE, cookieOptions, getSitePassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  const sitePassword = getSitePassword();

  if (!sitePassword) {
    return NextResponse.json({ ok: false, message: "Site password is not configured" }, { status: 503 });
  }

  if (!password || password !== sitePassword) {
    return NextResponse.json({ ok: false, message: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SITE_SESSION_COOKIE, SESSION_VALUE, cookieOptions());
  return response;
}
