import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { volunteerRequests } from "@/drizzle/schema";
import { isAdmin } from "@/lib/adminAuth";
import { VolunteerSchema } from "@/lib/schemas";

// GET /api/volunteer — admin: bütün müraciətlər
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const list = await db
    .select()
    .from(volunteerRequests)
    .orderBy(volunteerRequests.createdAt);
  return NextResponse.json(list);
}

// POST /api/volunteer — ictimai: könüllü müraciəti
export async function POST(req: NextRequest) {
  const parsed = VolunteerSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Məlumatlar düzgün deyil", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { _trap, ...data } = parsed.data;
  if (_trap) return NextResponse.json({ ok: true }); // honeypot

  const [record] = await db.insert(volunteerRequests).values(data).returning();
  return NextResponse.json(record, { status: 201 });
}
