import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.ADMIN_TELEGRAM_CHAT_ID;

  const results: Record<string, unknown> = {
    token_set: !!token,
    token_prefix: token ? token.slice(0, 10) + "..." : null,
    chat_id_set: !!chatId,
  };

  // 1. Bot məlumatlarını yoxla
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const me = await meRes.json();
    results.getMe = me;
  } catch (err) {
    results.getMe_error = String(err);
  }

  // 2. Admin-ə test mesajı göndər
  if (chatId) {
    try {
      const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🤖 Bot test mesajı — webhook işləyir!",
        }),
      });
      results.sendMessage = await sendRes.json();
    } catch (err) {
      results.sendMessage_error = String(err);
    }
  }

  // 3. Bot kodunun import olunub-olmadığını yoxla
  try {
    const { bot } = await import("@/lib/telegram");
    results.bot_initialized = true;
    results.bot_token_match = bot.token === token;
  } catch (err) {
    results.bot_import_error = String(err);
  }

  return NextResponse.json(results);
}
