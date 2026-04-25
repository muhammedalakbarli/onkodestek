import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { volunteerRequests } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

const COOKIE_NAME = "onko_admin_token";
const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? "dev-secret");

export async function GET() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return new NextResponse("Unauthorized", { status: 401 });
  try {
    await jwtVerify(token, secret);
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const rows = await db
    .select()
    .from(volunteerRequests)
    .orderBy(sql`${volunteerRequests.createdAt} desc`);

  const header = ["ID", "Tarix", "Ad Soyad", "Email", "Telefon", "Sahə", "Baxılıb", "CV", "Qeyd"].join(",");
  const lines = rows.map((v) => [
    v.id,
    formatDate(v.createdAt),
    `"${v.fullName.replace(/"/g, '""')}"`,
    v.email ?? "",
    v.phone ?? "",
    `"${(v.area ?? "").replace(/"/g, '""')}"`,
    v.isReviewed ? "Bəli" : "Xeyr",
    v.cvUrl ?? "",
    `"${(v.adminNote ?? "").replace(/"/g, '""')}"`,
  ].join(","));

  const csv = [header, ...lines].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="volunteers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
