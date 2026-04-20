import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { auth } from "@/auth";

const SECRET      = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");
const COOKIE_NAME = "onko_admin_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /dashboard/login — açıq
  if (pathname === "/dashboard/login") return NextResponse.next();

  // /dashboard/* — köhnə JWT cookie ilə qoru
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL("/dashboard/login", req.url));
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  // /me — NextAuth sessiyası lazımdır
  if (pathname.startsWith("/me")) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/me/:path*", "/me"],
};
