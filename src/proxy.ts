import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, SESSION_VALUE, SITE_SESSION_COOKIE } from "@/lib/auth";

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/photos") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasSiteSession = request.cookies.get(SITE_SESSION_COOKIE)?.value === SESSION_VALUE;
  const hasAdminSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value === SESSION_VALUE;

  if (pathname === "/unlock") {
    if (hasSiteSession) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/unlock") {
    if (hasAdminSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (!hasSiteSession) {
      const url = new URL("/unlock", request.url);
      url.searchParams.set("next", "/admin/unlock");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!hasSiteSession) {
    const url = new URL("/unlock", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && !hasAdminSession) {
    return NextResponse.redirect(new URL("/admin/unlock", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
