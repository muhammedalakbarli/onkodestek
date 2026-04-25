import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { platformDonations } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";

const PublicDonateSchema = z.object({
  donorName:   z.string().max(255).optional().nullable(),
  amount:      z.coerce.number().positive().max(100000),
  isAnonymous: z.boolean().default(false),
  note:        z.string().max(500).optional().nullable(),
});

// GET /api/platform-donations — ictimai
export async function GET() {
  const list = await db
    .select()
    .from(platformDonations)
    .orderBy(desc(platformDonations.createdAt));
  return NextResponse.json(list);
}

// POST /api/platform-donations — ictimai (bağış bildirişi)
export async function POST(req: NextRequest) {
  const parsed = PublicDonateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Məlumatlar düzgün deyil" }, { status: 400 });
  }

  const { donorName, amount, isAnonymous, note } = parsed.data;
  const [record] = await db
    .insert(platformDonations)
    .values({
      donorName: isAnonymous ? null : (donorName ?? null),
      amount: amount.toFixed(2),
      isAnonymous,
      note: note ?? null,
    })
    .returning();
  return NextResponse.json(record, { status: 201 });
}
