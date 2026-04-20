import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";
  const webhookUrl = `${appUrl}/api/telegram`;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  await bot.api.setWebhook(webhookUrl, {
    secret_token: webhookSecret,
    allowed_updates: ["message", "callback_query"],
  });

  const info = await bot.api.getWebhookInfo();

  return NextResponse.json({
    ok: true,
    webhook_url: webhookUrl,
    info,
  });
}
