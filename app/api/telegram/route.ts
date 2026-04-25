import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/lib/telegram";

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
    return await handleWebhook(req);
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Sağlamlıq yoxlaması
export function GET() {
  return NextResponse.json({ ok: true, bot: "onkodestek" });
}
