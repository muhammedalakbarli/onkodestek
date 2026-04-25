import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const APP = "https://onkodestek.vercel.app";

const Schema = z.object({
  amount:      z.number().min(1).max(10000),
  donorName:   z.string().max(255).optional().nullable(),
  isAnonymous: z.boolean().default(false),
  note:        z.string().max(500).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const key      = process.env.PAYRIFF_SECRET_KEY;
  const merchant = process.env.PAYRIFF_MERCHANT_ID;
  if (!key || !merchant) {
    return NextResponse.json({ error: "Ödəniş sistemi konfiqurasiya edilməyib" }, { status: 503 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Sorğu oxunmadı" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Məlumatlar düzgün deyil" }, { status: 400 });
  }

  const { amount, donorName, isAnonymous, note } = parsed.data;

  const payriffRes = await fetch("https://api.payriff.com/api/v2/createOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": key },
    body: JSON.stringify({
      body: {
        amount,
        currencyType:  "AZN",
        language:      "AZ",
        description:   "OnkoDəstək — Platforma ianəsi",
        approveURL:    `${APP}/donate?success=1`,
        cancelURL:     `${APP}/donate?cancelled=1`,
        declineURL:    `${APP}/donate?declined=1`,
        cardStorage:   false,
      },
      merchant,
    }),
  });

  let payriffData: Record<string, unknown>;
  try { payriffData = await payriffRes.json(); } catch {
    return NextResponse.json({ error: "PayRiff cavab vermedi" }, { status: 502 });
  }

  if (payriffData.code !== "00000") {
    console.error("PayRiff createOrder error:", payriffData);
    return NextResponse.json({ error: (payriffData.message as string) ?? "Ödəniş xətası" }, { status: 400 });
  }

  const payload = payriffData.payload as Record<string, unknown>;
  const orderId    = payload.orderId as string;
  const paymentUrl = payload.paymentUrl as string;

  // Donor məlumatlarını müvəqqəti saxla (callback gəldikdə istifadə üçün)
  try {
    const { db }          = await import("@/lib/db");
    const { botSessions } = await import("@/drizzle/schema");
    await db.insert(botSessions)
      .values({
        key:       `payriff:pending:${orderId}`,
        value:     JSON.stringify({ donorName: isAnonymous ? null : donorName, isAnonymous, note, amount }),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: botSessions.key,
        set:    { value: JSON.stringify({ donorName: isAnonymous ? null : donorName, isAnonymous, note, amount }), updatedAt: new Date() },
      });
  } catch (e) {
    console.error("Pending order save error:", e);
  }

  return NextResponse.json({ paymentUrl });
}
