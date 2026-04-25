import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET      = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");
const COOKIE_NAME = "onko_admin_token";

/**
 * JWT cookie (dashboard login-dən) və ya x-admin-secret header-ini yoxlayır.
 * İkisindən biri keçsə admin sayılır.
 */
export async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      return true;
    } catch { /* token yanlışdır */ }
  }

  const secret = req.headers.get("x-admin-secret");
  if (secret && secret === process.env.ADMIN_SECRET) {
    return true;
  }

  return false;
}

/**
 * JWT-dən admin emailini oxuyur. Əgər yoxdursa "admin" qaytarır.
 */
export async function getAdminEmail(req: NextRequest): Promise<string> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      return (payload.email as string) || "admin";
    } catch { /* fall through */ }
  }
  return "admin";
}
