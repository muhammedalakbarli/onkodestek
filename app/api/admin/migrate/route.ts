import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

// Bir dəfəlik migration: yeni sütunları yarat
// İstifadədən sonra bu faylı silin
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  // patient_updates cədvəli
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

  // volunteer_requests-ə cv_url sütunu
  try {
    await db.execute(sql`
      ALTER TABLE volunteer_requests ADD COLUMN IF NOT EXISTS cv_url TEXT
    `);
    results.push("volunteer_requests.cv_url: OK");
  } catch (err) {
    results.push(`volunteer_requests.cv_url: XƏTA — ${err}`);
  }

  // volunteer_requests-ə admin_note sütunu
  try {
    await db.execute(sql`
      ALTER TABLE volunteer_requests ADD COLUMN IF NOT EXISTS admin_note TEXT
    `);
    results.push("volunteer_requests.admin_note: OK");
  } catch (err) {
    results.push(`volunteer_requests.admin_note: XƏTA — ${err}`);
  }

  // audit_logs cədvəli
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id           SERIAL PRIMARY KEY,
        admin_email  VARCHAR(255) NOT NULL,
        action       VARCHAR(100) NOT NULL,
        entity_type  VARCHAR(50),
        entity_id    INTEGER,
        detail       TEXT,
        created_at   TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    results.push("audit_logs: OK");
  } catch (err) {
    results.push(`audit_logs: XƏTA — ${err}`);
  }

  return NextResponse.json({ done: true, results });
}
