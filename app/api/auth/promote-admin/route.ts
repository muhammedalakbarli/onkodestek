import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { signAdminToken, COOKIE_NAME, TOKEN_TTL } from "@/lib/auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// NextAuth OAuth-dan sonra bu route-a yönləndirilir.
// Əgər istifadəçi ADMIN_EMAILS-dədirsə, onko_admin_token cookie-si qoyulur
// və /dashboard-a yönləndirilir.
export async function GET(req: NextRequest) {
  const session = await auth();
  const email   = session?.user?.email?.toLowerCase() ?? "";

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url));
  }

  const token = await signAdminToken();
  const res   = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   TOKEN_TTL,
    path:     "/",
  });
  return res;
}
