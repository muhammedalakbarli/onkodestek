import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { isAdmin } from "@/lib/adminAuth";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json() as {
    action: "ban" | "unban";
    days?: number;   // 0 = permanent (bannedUntil = year 2099)
    reason?: string;
  };

  if (body.action === "unban") {
    await db.update(users)
      .set({ bannedUntil: null, banReason: null })
      .where(eq(users.id, id));
    return NextResponse.json({ ok: true });
  }

  if (body.action === "ban") {
    const bannedUntil = body.days === 0 || body.days === undefined
      ? new Date("2099-12-31T23:59:59Z")
      : new Date(Date.now() + body.days * 24 * 60 * 60 * 1000);

    await db.update(users)
      .set({ bannedUntil, banReason: body.reason ?? null })
      .where(eq(users.id, id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
