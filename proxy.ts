import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAuthRoute = request.nextUrl.pathname.startsWith("/api/admin/login") ||
    request.nextUrl.pathname.startsWith("/api/admin/logout");
  const hasSession = request.cookies.has("sendiko_admin_session");

  if (!isLoginPage && !isAuthRoute && !hasSession) {
    if (request.nextUrl.pathname.startsWith("/api/admin/")) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
