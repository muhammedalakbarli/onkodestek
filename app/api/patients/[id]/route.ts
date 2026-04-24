import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/adminAuth";
import { PatientPatchSchema } from "@/lib/schemas";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const patientId = parseInt(id);
  if (isNaN(patientId)) {
    return NextResponse.json({ error: "Yanlış id" }, { status: 400 });
  }
  try {
    await db.delete(transactions).where(eq(transactions.patientId, patientId));
    await db.delete(patients).where(eq(patients.id, patientId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patientId = parseInt(id);
  if (isNaN(patientId)) {
    return NextResponse.json({ error: "Yanlış id" }, { status: 400 });
  }
  try {
    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient) {
      return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });
    }

    const txList = await db
      .select()
      .from(transactions)
      .where(eq(transactions.patientId, patient.id))
      .orderBy(transactions.createdAt);

    return NextResponse.json({ patient, transactions: txList });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}

// PATCH /api/patients/[id] — admin: məlumatları yenilə
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const patientId = parseInt(id);
  if (isNaN(patientId)) {
    return NextResponse.json({ error: "Yanlış id" }, { status: 400 });
  }

  try {
    const parsed = PatientPatchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Məlumatlar düzgün deyil", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const autoPublic =
      parsed.data.status === "active" || parsed.data.status === "funded"
        ? { isPublic: true }
        : parsed.data.status === "pending" || parsed.data.status === "closed"
        ? { isPublic: false }
        : {};

    const [updated] = await db
      .update(patients)
      .set({ ...parsed.data, ...autoPublic, updatedAt: new Date() })
      .where(eq(patients.id, patientId))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
