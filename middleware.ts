import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET      = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");
const COOKIE_NAME = "onko_admin_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login səhifəsini qoruma
  if (pathname === "/dashboard/login") return NextResponse.next();

  // /dashboard/* üçün token yoxla
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
