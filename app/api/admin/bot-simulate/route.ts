import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chatId = req.nextUrl.searchParams.get("chat_id");
  if (!chatId) {
    return NextResponse.json({ error: "?chat_id= lazımdır. Öz Telegram ID-nizi yazın." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN yoxdur" });

  // Birbaşa Telegram API-yə test mesajı göndər (webhook keçmədən)
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: parseInt(chatId),
      text: "✅ Bot işləyir! Bu birbaşa API testi idi.",
      parse_mode: "HTML",
    }),
  });

  const result = await res.json();
  return NextResponse.json({ direct_send: result });
}
