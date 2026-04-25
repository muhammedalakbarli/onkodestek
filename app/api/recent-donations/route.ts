import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions, patients, users } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const revalidate = 0;

export async function GET() {
  const rows = await db
    .select({
      id:          transactions.id,
      amount:      transactions.amount,
      isAnonymous: transactions.isAnonymous,
      createdAt:   transactions.createdAt,
      patientName: patients.fullName,
      donorName:   users.name,
    })
    .from(transactions)
    .leftJoin(patients, eq(transactions.patientId, patients.id))
    .leftJoin(users, eq(transactions.donorUserId, users.id))
    .where(eq(transactions.type, "donation"))
    .orderBy(desc(transactions.createdAt))
    .limit(20);

  return NextResponse.json(rows);
}
