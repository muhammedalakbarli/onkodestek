import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, COOKIE_NAME, TOKEN_TTL } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Şifrə yanlışdır" }, { status: 401 });
  }

  const token = await signAdminToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_TTL,
    path: "/",
  });
  return res;
}
