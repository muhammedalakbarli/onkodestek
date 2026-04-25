import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { transactions, patients } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

const COOKIE_NAME = "onko_admin_token";
const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? "dev-secret");

export async function GET() {
  // Admin auth check
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return new NextResponse("Unauthorized", { status: 401 });
  try {
    await jwtVerify(token, secret);
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const CATEGORY_LABELS: Record<string, string> = {
    medication: "Dərman", treatment: "Müalicə",
    consultation: "Konsultasiya", transport: "Nəqliyyat", other: "Digər",
  };

  const raw = await db
    .select({
      id:          transactions.id,
      patientName: patients.fullName,
      type:        transactions.type,
      amount:      transactions.amount,
      category:    transactions.category,
      description: transactions.description,
      donorName:   transactions.donorName,
      isAnonymous: transactions.isAnonymous,
      receiptUrl:  transactions.receiptUrl,
      createdAt:   transactions.createdAt,
    })
    .from(transactions)
    .leftJoin(patients, sql`${transactions.patientId} = ${patients.id}`)
    .orderBy(sql`${transactions.createdAt} desc`);

  const header = ["ID", "Tarix", "Xəstə", "Növ", "Kateqoriya", "Məbləğ (AZN)", "Donör", "Sənəd"].join(",");
  const rows = raw.map((t) => [
    t.id,
    formatDate(t.createdAt),
    `"${(t.patientName ?? "Naməlum").replace(/"/g, '""')}"`,
    t.type === "donation" ? "İanə" : "Xərc",
    t.type === "donation" ? "" : (CATEGORY_LABELS[t.category ?? ""] ?? t.category ?? ""),
    parseFloat(String(t.amount)).toFixed(2),
    `"${(t.isAnonymous ? "Anonim" : (t.donorName ?? "")).replace(/"/g, '""')}"`,
    t.receiptUrl ?? "",
  ].join(","));

  const csv = [header, ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="transactions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
