import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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
  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const [updated] = await db
      .update(patients)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(patients.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
