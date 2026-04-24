import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { PatientCreateSchema } from "@/lib/schemas";

// GET /api/patients — ictimai xəstələri gətir
export async function GET() {
  try {
    const list = await db
      .select()
      .from(patients)
      .where(eq(patients.isPublic, true))
      .orderBy(patients.createdAt);

    return NextResponse.json(list);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}

// POST /api/patients — admin: yeni xəstə əlavə et
export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = PatientCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Məlumatlar düzgün deyil", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [patient] = await db.insert(patients).values(parsed.data).returning();
    return NextResponse.json(patient, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
