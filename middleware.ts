import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { auth } from "@/auth";

const DASHBOARD_SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");
const DASHBOARD_COOKIE = "onko_admin_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Həmişə açıq olan yollar ───────────────────────────────────────────────
  if (pathname.startsWith("/api/auth"))         return NextResponse.next();
  if (pathname.startsWith("/api/telegram"))      return NextResponse.next();
  if (pathname.startsWith("/api/admin/magic"))   return NextResponse.next();
  if (pathname.startsWith("/api/admin/send-magic")) return NextResponse.next();
  if (pathname === "/login")               return NextResponse.next();
  if (pathname === "/dashboard/login")     return NextResponse.next();

  // ── Dashboard: JWT cookie qoruması ───────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(DASHBOARD_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }
    try {
      await jwtVerify(token, DASHBOARD_SECRET);
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL("/dashboard/login", req.url));
      res.cookies.delete(DASHBOARD_COOKIE);
      return res;
    }
  }

  // ── Ana səhifə: sessiya olmadan login-ə yönləndir ────────────────────────
  if (pathname === "/") {
    // Admin JWT cookie ilə giriş icazəsi
    const adminToken = req.cookies.get(DASHBOARD_COOKIE)?.value;
    if (adminToken) {
      try {
        await jwtVerify(adminToken, DASHBOARD_SECRET);
        return NextResponse.next();
      } catch {}
    }
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ── Əməliyyat səhifələri: mütləq login tələb olunur ─────────────────────
  if (pathname.startsWith("/apply") || pathname.startsWith("/me")) {
    const session = await auth();
    if (!session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Qalan hər şey (patients, transparency, about, track, api) — açıqdır ─
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|logo\\.jpeg|.*\\.png|.*\\.jpg|.*\\.webp|.*\\.svg|.*\\.ico).*)",
  ],
};
