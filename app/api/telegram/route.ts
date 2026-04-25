import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/lib/telegram";

// Webhook handler — bot.init() ilə botInfo əvvəlcədən yüklənir
let botReady = false;
async function ensureInit() {
  if (!botReady) {
    await bot.init();
    botReady = true;
  }
}

export async function POST(req: NextRequest) {
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (configuredSecret) {
    const incoming = req.headers.get("x-telegram-bot-api-secret-token");
    if (incoming !== configuredSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    await ensureInit();
    const update = await req.json();
    console.log("Telegram update:", JSON.stringify(update).slice(0, 200));
    await bot.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}

// Sağlamlıq yoxlaması
export function GET() {
  return NextResponse.json({ ok: true, bot: "onkodestek" });
}
