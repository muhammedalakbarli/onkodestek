import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, transactions } from "@/drizzle/schema";
import { isAdmin } from "@/lib/adminAuth";
import { eq, sql, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = await db
    .select({
      id:            users.id,
      name:          users.name,
      email:         users.email,
      image:         users.image,
      role:          users.role,
      createdAt:     users.createdAt,
      donationCount: sql<number>`cast(count(${transactions.id}) filter (where ${transactions.type} = 'donation') as int)`,
      donationTotal: sql<string>`coalesce(sum(${transactions.amount}) filter (where ${transactions.type} = 'donation'), '0')`,
    })
    .from(users)
    .leftJoin(transactions, eq(transactions.donorUserId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  return NextResponse.json(list);
}
