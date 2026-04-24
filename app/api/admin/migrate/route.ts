import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

const SECRET      = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");
const COOKIE_NAME = "onko_admin_token";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { await jwtVerify(token, SECRET); } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "volunteer_requests" (
        "id" serial PRIMARY KEY NOT NULL,
        "full_name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "phone" varchar(50),
        "area" varchar(100) NOT NULL,
        "message" text,
        "is_reviewed" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    results.push("volunteer_requests: OK");
  } catch (e) {
    results.push(`volunteer_requests: ${String(e)}`);
  }

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "platform_donations" (
        "id" serial PRIMARY KEY NOT NULL,
        "donor_name" varchar(255),
        "amount" numeric(12, 2) NOT NULL,
        "is_anonymous" boolean DEFAULT false NOT NULL,
        "note" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    results.push("platform_donations: OK");
  } catch (e) {
    results.push(`platform_donations: ${String(e)}`);
  }

  return NextResponse.json({ done: true, results });
}
