import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, SITE_SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SITE_SESSION_COOKIE);
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
