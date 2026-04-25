import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { volunteerRequests } from "@/drizzle/schema";
import { isAdmin, getAdminEmail } from "@/lib/adminAuth";
import { logAction } from "@/lib/audit";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const patch: Record<string, unknown> = {};
  if ("isReviewed" in body) patch.isReviewed = Boolean(body.isReviewed);
  if ("adminNote"  in body) patch.adminNote  = body.adminNote ?? null;
  const [updated] = await db
    .update(volunteerRequests)
    .set(patch)
    .where(eq(volunteerRequests.id, parseInt(id)))
    .returning();
  if (!updated) return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });
  logAction({ adminEmail: await getAdminEmail(req), action: "volunteer.review", entityType: "volunteer", entityId: parseInt(id), detail: JSON.stringify(patch) }).catch(() => {});
  return NextResponse.json(updated);
}
