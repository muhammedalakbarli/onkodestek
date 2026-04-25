import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { db } from "@/lib/db";
import { botSessions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [row] = await db
    .select()
    .from(botSessions)
    .where(eq(botSessions.key, "debug:last_update"));

  if (!row) {
    return NextResponse.json({
      found: false,
      message: "Heç bir update almınmayıb. Bota mesaj yazın, sonra yenidən yoxlayın.",
    });
  }

  return NextResponse.json({
    found: true,
    updatedAt: row.updatedAt,
    update: JSON.parse(row.value),
  });
}
