import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq, sum, count, sql } from "drizzle-orm";

// GET /api/stats — dashboard üçün ümumi statistika
export async function GET() {
  try {
    const [patientStats] = await db
      .select({
        total: count(),
        active: sql<number>`count(*) filter (where status = 'active')`,
        funded: sql<number>`count(*) filter (where status = 'funded')`,
        pending: sql<number>`count(*) filter (where status = 'pending')`,
        totalGoal: sum(patients.goalAmount),
        totalCollected: sum(patients.collectedAmount),
      })
      .from(patients);

    const [txStats] = await db
      .select({
        totalDonations: sql<number>`coalesce(sum(amount) filter (where type = 'donation'), 0)`,
        totalExpenses: sql<number>`coalesce(sum(amount) filter (where type = 'expense'), 0)`,
        donationCount: sql<number>`count(*) filter (where type = 'donation')`,
      })
      .from(transactions);

    return NextResponse.json({
      patients: patientStats,
      transactions: txStats,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
