import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { volunteerRequests } from "@/drizzle/schema";
import { isAdmin, getAdminEmail } from "@/lib/adminAuth";
import { logAction } from "@/lib/audit";
import { eq } from "drizzle-orm";
import {
  sendVolunteerInterviewInvite,
  sendVolunteerAccepted,
  sendVolunteerRejected,
} from "@/lib/email";

const AREA_LABELS: Record<string, string> = {
  tibbi:     "Tibbi dəstək",
  hüquqi:    "Hüquqi yardım",
  texniki:   "Texniki dəstək",
  media:     "Media / PR",
  psixoloji: "Psixoloji dəstək",
  digər:     "Digər",
};

const VALID_STATUSES = ["pending", "interview", "accepted", "rejected"];

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
  if ("status" in body && VALID_STATUSES.includes(body.status)) {
    patch.status     = body.status;
    patch.isReviewed = true;
  }

  const [updated] = await db
    .update(volunteerRequests)
    .set(patch)
    .where(eq(volunteerRequests.id, parseInt(id)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });

  // Status dəyişdikdə email göndər
  if (patch.status && patch.status !== "pending") {
    const areaLabel = AREA_LABELS[updated.area] ?? updated.area;
    const emailArgs = { toEmail: updated.email, toName: updated.fullName, area: areaLabel };

    if (patch.status === "interview") {
      sendVolunteerInterviewInvite(emailArgs).catch(console.error);
    } else if (patch.status === "accepted") {
      sendVolunteerAccepted(emailArgs).catch(console.error);
    } else if (patch.status === "rejected") {
      sendVolunteerRejected(emailArgs).catch(console.error);
    }
  }

  logAction({
    adminEmail: await getAdminEmail(req),
    action:     "volunteer.update",
    entityType: "volunteer",
    entityId:   parseInt(id),
    detail:     JSON.stringify(patch),
  }).catch(() => {});

  return NextResponse.json(updated);
}
