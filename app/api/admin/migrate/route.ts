import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

// Bir dəfəlik migration: patient_updates cədvəlini yarat
// İstifadədən sonra bu faylı silin
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS patient_updates (
        id         SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        content    TEXT NOT NULL,
        photo_url  TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    results.push("patient_updates: OK");
  } catch (err) {
    results.push(`patient_updates: XƏTA — ${err}`);
  }

  return NextResponse.json({ done: true, results });
}
