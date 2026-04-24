import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { platformDonations } from "@/drizzle/schema";
import { isAdmin } from "@/lib/adminAuth";
import { PlatformDonationSchema } from "@/lib/schemas";
import { desc } from "drizzle-orm";

// GET /api/platform-donations — ictimai
export async function GET() {
  const list = await db
    .select()
    .from(platformDonations)
    .orderBy(desc(platformDonations.createdAt));
  return NextResponse.json(list);
}

// POST /api/platform-donations — yalnız admin
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = PlatformDonationSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Məlumatlar düzgün deyil", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const [record] = await db.insert(platformDonations).values(parsed.data).returning();
  return NextResponse.json(record, { status: 201 });
}
