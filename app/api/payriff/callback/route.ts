import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const key = process.env.PAYRIFF_SECRET_KEY;
  if (!key) return new Response(null, { status: 200 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new Response(null, { status: 200 }); }

  const orderId = (body.orderId ?? body.order_id ?? body.id) as string | undefined;
  if (!orderId) return new Response(null, { status: 200 });

  // Ödənişi server tərəfindən yoxla
  let verifyData: Record<string, unknown>;
  try {
    const verifyRes = await fetch(`https://api.payriff.com/api/v3/orders/${orderId}`, {
      headers: { "Authorization": key },
    });
    verifyData = await verifyRes.json();
  } catch {
    return new Response(null, { status: 200 });
  }

  const payload = verifyData.payload as Record<string, unknown> | undefined;
  if (verifyData.code !== "00000" || payload?.paymentStatus !== "PAID") {
    return new Response(null, { status: 200 });
  }

  const { db }                              = await import("@/lib/db");
  const { botSessions, platformDonations }  = await import("@/drizzle/schema");
  const { eq }                              = await import("drizzle-orm");

  // Saxlanmış donor məlumatlarını götür
  let donorName:   string | null = null;
  let isAnonymous: boolean       = true;
  let note:        string | null = null;
  const paidAmount = parseFloat(String(payload.amount ?? 0));

  const [pending] = await db
    .select()
    .from(botSessions)
    .where(eq(botSessions.key, `payriff:pending:${orderId}`));

  if (pending) {
    try {
      const data  = JSON.parse(pending.value) as Record<string, unknown>;
      donorName   = (data.donorName as string | null) ?? null;
      isAnonymous = Boolean(data.isAnonymous ?? true);
      note        = (data.note as string | null) ?? null;
    } catch {}
    await db.delete(botSessions).where(eq(botSessions.key, `payriff:pending:${orderId}`));
  }

  // platformDonations-a əlavə et (eyni orderId ikinci dəfə gəlməsin deyə ignore)
  try {
    await db.insert(platformDonations).values({
      donorName,
      amount:      String(paidAmount > 0 ? paidAmount : (JSON.parse(pending?.value ?? "{}") as Record<string, unknown>).amount ?? 0),
      isAnonymous,
      note,
    });
  } catch (e) {
    console.error("platformDonations insert error:", e);
  }

  return new Response(null, { status: 200 });
}
