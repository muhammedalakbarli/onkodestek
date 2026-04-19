import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await handleWebhook(req);
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
