import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserBanStatus(userId: string): Promise<{
  isBanned: boolean;
  bannedUntil: Date | null;
  banReason: string | null;
}> {
  try {
    const [row] = await db
      .select({ bannedUntil: users.bannedUntil, banReason: users.banReason })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!row?.bannedUntil) return { isBanned: false, bannedUntil: null, banReason: null };
    const isBanned = row.bannedUntil > new Date();
    return { isBanned, bannedUntil: row.bannedUntil, banReason: row.banReason };
  } catch {
    return { isBanned: false, bannedUntil: null, banReason: null };
  }
}
