import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  // Yalnız TELEGRAM_WEBHOOK_SECRET set edilibsə yoxla
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (configuredSecret) {
    const incoming = req.headers.get("x-telegram-bot-api-secret-token");
    if (incoming !== configuredSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const update = await req.json();
    await bot.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    // 200 qaytar ki Telegram yenidən cəhd etməsin
    return NextResponse.json({ ok: true });
  }
}

// Sağlamlıq yoxlaması
export function GET() {
  return NextResponse.json({ ok: true, bot: "onkodestek" });
}
