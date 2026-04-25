import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patientUpdates, patients, transactions, users } from "@/drizzle/schema";
import { isAdmin } from "@/lib/adminAuth";
import { eq, desc, and, isNotNull, inArray } from "drizzle-orm";
import { z } from "zod";
import { sendPatientUpdateNotification } from "@/lib/email";
import { getAdminEmail } from "@/lib/adminAuth";
import { logAction } from "@/lib/audit";

const CreateSchema = z.object({
  patientId: z.number().int().positive(),
  content:   z.string().min(1).max(2000),
  photoUrl:  z.string().url().optional().or(z.literal("")),
});

// GET /api/patient-updates?patientId=X
export async function GET(req: NextRequest) {
  const patientId = parseInt(req.nextUrl.searchParams.get("patientId") ?? "");
  if (isNaN(patientId)) {
    return NextResponse.json({ error: "patientId tələb olunur" }, { status: 400 });
  }
  const list = await db
    .select()
    .from(patientUpdates)
    .where(eq(patientUpdates.patientId, patientId))
    .orderBy(desc(patientUpdates.createdAt));
  return NextResponse.json(list);
}

// POST /api/patient-updates — admin only
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = CreateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Məlumatlar düzgün deyil" }, { status: 400 });
  }
  const { photoUrl, ...rest } = parsed.data;
  const [record] = await db
    .insert(patientUpdates)
    .values({ ...rest, photoUrl: photoUrl || null })
    .returning();

  logAction({ adminEmail: await getAdminEmail(req), action: "patient_update.create", entityType: "patient", entityId: rest.patientId, detail: rest.content.slice(0, 200) }).catch(() => {});

  // Notify donors asynchronously
  (async () => {
    try {
      const [patient] = await db.select({ fullName: patients.fullName })
        .from(patients).where(eq(patients.id, rest.patientId));
      if (!patient) return;

      const donorIds = await db
        .selectDistinct({ donorUserId: transactions.donorUserId })
        .from(transactions)
        .where(and(
          eq(transactions.patientId, rest.patientId),
          eq(transactions.type, "donation"),
          isNotNull(transactions.donorUserId),
        ));

      const ids = donorIds.map((d) => d.donorUserId!).filter(Boolean);
      if (!ids.length) return;

      const donorUsers = await db
        .select({ email: users.email, name: users.name })
        .from(users)
        .where(and(inArray(users.id, ids), isNotNull(users.email)));

      const donors = donorUsers
        .filter((u) => u.email)
        .map((u) => ({ email: u.email!, name: u.name }));

      await sendPatientUpdateNotification({
        donors,
        patientName: patient.fullName,
        patientId: rest.patientId,
        updateContent: rest.content,
      });
    } catch (err) {
      console.error("Donor bildiriş xətası:", err);
    }
  })();

  return NextResponse.json(record, { status: 201 });
}

// DELETE /api/patient-updates?id=X — admin only
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = parseInt(req.nextUrl.searchParams.get("id") ?? "");
  if (isNaN(id)) return NextResponse.json({ error: "id tələb olunur" }, { status: 400 });
  await db.delete(patientUpdates).where(eq(patientUpdates.id, id));
  return NextResponse.json({ ok: true });
}
