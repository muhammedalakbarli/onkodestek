import { db } from "@/lib/db";
import { auditLogs } from "@/drizzle/schema";

export async function logAction({
  adminEmail,
  action,
  entityType,
  entityId,
  detail,
}: {
  adminEmail: string;
  action: string;
  entityType?: string;
  entityId?: number;
  detail?: string;
}) {
  try {
    await db.insert(auditLogs).values({ adminEmail, action, entityType, entityId, detail });
  } catch (err) {
    console.error("Audit log xətası:", err);
  }
}
