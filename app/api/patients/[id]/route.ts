import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/adminAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.delete(transactions).where(eq(transactions.patientId, parseInt(id)));
    await db.delete(patients).where(eq(patients.id, parseInt(id)));
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
  try {
    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, parseInt(id)));

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

// PATCH /api/patients/[id] — admin: statusu yenilə, ictimaiyyətə aç
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();

    // Status "active" və ya "funded" olduqda isPublic avtomatik true olsun
    // Status "pending" və ya "closed" olduqda isPublic false olsun
    const autoPublic =
      body.status === "active" || body.status === "funded"
        ? { isPublic: true }
        : body.status === "pending" || body.status === "closed"
        ? { isPublic: false }
        : {};

    const [updated] = await db
      .update(patients)
      .set({ ...body, ...autoPublic, updatedAt: new Date() })
      .where(eq(patients.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
