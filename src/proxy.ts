import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page and auth API routes
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  // Protect /admin pages and /api/admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return Response.json(
          { error: "Yetkilendirme gerekli" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return Response.json(
          { error: "Oturum süresi dolmuş" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
