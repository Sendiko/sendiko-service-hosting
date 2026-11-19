import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isAdminLoginPage = pathname === "/admin/login";
    const isAdminAuthRoute = pathname.startsWith("/api/admin/login") ||
      pathname.startsWith("/api/admin/logout");
    const hasAdminSession = request.cookies.has("sendiko_admin_session");

    if (!isAdminLoginPage && !isAdminAuthRoute && !hasAdminSession) {
      if (pathname.startsWith("/api/admin/")) {
        return NextResponse.json({ error: "Authentication required." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (isAdminLoginPage && hasAdminSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // Customer account routes protection
  if (pathname === "/account" || pathname.startsWith("/account/") || pathname.startsWith("/api/account")) {
    const isCustomerAuthPage = pathname === "/account/login" || pathname === "/account/register";
    const isCustomerPublicApi = pathname === "/api/account/login" || pathname === "/api/account/register";
    const hasCustomerSession = request.cookies.has("sendiko_customer_session");

    if (isCustomerAuthPage && hasCustomerSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    if (!isCustomerAuthPage && !isCustomerPublicApi && !hasCustomerSession) {
      if (pathname.startsWith("/api/account")) {
        return NextResponse.json({ error: "Authentication required." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/account/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/account",
    "/account/:path*",
    "/api/account",
    "/api/account/:path*",
  ],
};
