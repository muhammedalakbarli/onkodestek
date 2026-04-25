import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { volunteerRequests } from "@/drizzle/schema";
import { isAdmin } from "@/lib/adminAuth";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { isReviewed } = await req.json();
  const [updated] = await db
    .update(volunteerRequests)
    .set({ isReviewed: Boolean(isReviewed) })
    .where(eq(volunteerRequests.id, parseInt(id)))
    .returning();
  if (!updated) return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });
  return NextResponse.json(updated);
}
