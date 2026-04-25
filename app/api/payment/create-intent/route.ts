import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const Schema = z.object({
  amount: z.number().int().min(100).max(10000000, "Maksimum 100,000 ₼"),
  currency: z.string().default("azn"),
});

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: "Ödəniş sistemi konfiqurasiya edilməyib" }, { status: 503 });

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Məbləğ düzgün deyil" }, { status: 400 });

  const stripe = new Stripe(key);
  const { amount, currency } = parsed.data;

  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: { type: "platform_donation" },
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}
