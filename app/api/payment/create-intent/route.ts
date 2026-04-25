import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const Schema = z.object({
  amount: z.number().int().min(50).max(10000000),
});

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Ödəniş sistemi konfiqurasiya edilməyib" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Sorğu məlumatları oxunmadı" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Məbləğ düzgün deyil" }, { status: 400 });
  }

  try {
    const stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
    const intent = await stripe.paymentIntents.create({
      amount: parsed.data.amount,
      currency: "azn",
      payment_method_types: ["card"],
      metadata: { type: "platform_donation" },
    });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Stripe xətası";
    console.error("Stripe PaymentIntent xətası:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
