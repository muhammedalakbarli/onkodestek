import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { auth } from "@/auth";

const DASHBOARD_SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");
const DASHBOARD_COOKIE = "onko_admin_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Həmişə açıq olan yollar ───────────────────────────────────────────────
  // NextAuth daxili callback-lər
  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  // Telegram webhook — Telegram serverləri üçün açıq
  if (pathname.startsWith("/api/telegram")) return NextResponse.next();
  // Login səhifəsi
  if (pathname === "/login") return NextResponse.next();
  // Dashboard öz login səhifəsi
  if (pathname === "/dashboard/login") return NextResponse.next();

  // ── Dashboard: ayrı JWT cookie qoruması ──────────────────────────────────
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

  // ── Digər hər şey: NextAuth sessiyası tələb olunur ────────────────────────
  const session = await auth();
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Static fayllar və Next.js daxili resurslar istisna
    "/((?!_next/static|_next/image|favicon\\.ico|logo\\.jpeg|.*\\.png|.*\\.jpg|.*\\.webp|.*\\.svg|.*\\.ico).*)",
  ],
};
