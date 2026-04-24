import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET      = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");
const COOKIE_NAME = "onko_admin_token";

export async function GET(req: NextRequest) {
  // Admin JWT cookie tələb et
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await jwtVerify(token, SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const botToken   = process.env.TELEGRAM_BOT_TOKEN;
  const secret     = process.env.TELEGRAM_WEBHOOK_SECRET;
  const appUrl     = (process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app").trim();

  if (!botToken) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN yoxdur" }, { status: 500 });
  }

  const webhookUrl = `${appUrl}/api/telegram`;

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: secret ?? "",
        allowed_updates: ["message", "callback_query"],
        drop_pending_updates: true,
      }),
    }
  );

  const data = await res.json();

  if (!data.ok) {
    return NextResponse.json({ error: "Telegram xətası", detail: data }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    webhook: webhookUrl,
    message: "Bot webhook uğurla qeydiyyata alındı. Bot indi 7/24 aktiv işləyir.",
  });
}
