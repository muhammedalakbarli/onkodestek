import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions, patients } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { isAdmin } from "@/lib/adminAuth";
import { TransactionCreateSchema } from "@/lib/schemas";

// GET /api/transactions — bütün əməliyyatları gətir (ictimai)
export async function GET() {
  try {
    const list = await db
      .select()
      .from(transactions)
      .orderBy(transactions.createdAt);

    return NextResponse.json(list);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}

// POST /api/transactions — admin: ianə və ya xərc əlavə et
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = TransactionCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Məlumatlar düzgün deyil", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [tx] = await db.insert(transactions).values(parsed.data).returning();

    if (tx.type === "donation") {
      await db
        .update(patients)
        .set({
          collectedAmount: sql`collected_amount + ${tx.amount}`,
          updatedAt: new Date(),
        })
        .where(eq(patients.id, tx.patientId));
    }

    return NextResponse.json(tx, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
