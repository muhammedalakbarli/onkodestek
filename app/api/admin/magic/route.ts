import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { signAdminToken, COOKIE_NAME, TOKEN_TTL } from "@/lib/auth";

const SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login?error=missing", req.url));
  }

  try {
    const { payload } = await jwtVerify(decodeURIComponent(token), SECRET);
    if (payload.type !== "magic" || payload.role !== "admin") {
      throw new Error("invalid");
    }
  } catch {
    return NextResponse.redirect(new URL("/dashboard/login?error=invalid", req.url));
  }

  // Magic token etibarlıdır — 30 günlük admin session cookie yarat
  const adminToken = await signAdminToken();
  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set(COOKIE_NAME, adminToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   TOKEN_TTL,
    path:     "/",
  });
  return res;
}
