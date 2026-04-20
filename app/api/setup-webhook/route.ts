import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN yoxdur" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";
  const webhookUrl = `${appUrl}/api/telegram`;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  const params: Record<string, unknown> = {
    url: webhookUrl,
    allowed_updates: ["message", "callback_query"],
  };
  if (webhookSecret) params.secret_token = webhookSecret;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const result = await res.json();

  if (!result.ok) {
    return NextResponse.json({ error: result.description, result }, { status: 500 });
  }

  const infoRes = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const info = await infoRes.json();

  return NextResponse.json({ ok: true, webhook_url: webhookUrl, info });
}
