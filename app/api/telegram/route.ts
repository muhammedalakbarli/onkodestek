import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ ok: true });

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = (update.message ?? update.edited_message) as Record<string, unknown> | undefined;
  if (msg) {
    const chat = msg.chat as Record<string, unknown>;
    const chatId = chat.id as number;
    const text = (msg.text as string | undefined) ?? "";

    let reply = "";
    if (text.startsWith("/start")) {
      reply =
        `Salam! 👋\n\n<b>Onkodəstək</b> platformasına xoş gəldiniz.\n\n` +
        `Biz Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf şəkildə maddi dəstək göstəririk.\n\n` +
        `💙 Yardım: https://onkodestek.vercel.app/apply\n` +
        `📊 Müraciəti izlə: /izle OKD-XXXXXX`;
    } else if (text.startsWith("/izle ")) {
      const trackId = text.slice(6).trim().toUpperCase();
      reply = `🔍 İzləmə kodu: <b>${trackId}</b>\n\nhttps://onkodestek.vercel.app/track?id=${trackId}`;
    } else if (text.startsWith("/myid")) {
      reply = `🆔 Chat ID: <code>${chatId}</code>`;
    } else {
      reply = `💙 Yardım üçün: https://onkodestek.vercel.app/apply\n📊 Müraciəti izlə: /izle OKD-XXXXXX`;
    }

    if (reply) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: "HTML" }),
      });
    }
  }

  const cq = update.callback_query as Record<string, unknown> | undefined;
  if (cq) {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: cq.id as string }),
    });
    const cqChat = ((cq.message as Record<string, unknown>)?.chat as Record<string, unknown>);
    const cqChatId = cqChat?.id as number | undefined;
    if (cqChatId && cq.data === "about") {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: cqChatId,
          text: `ℹ️ <b>Onkodəstək</b>\n\n✅ Hər xəstə sənəd yoxlamasından keçir\n✅ Hər ianə birbaşa xəstəyə çatır\n✅ Hər xərc ictimaiyyətə açıqlanır\n\n🌐 https://onkodestek.vercel.app`,
          parse_mode: "HTML",
        }),
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: true, bot: "onkodestek" });
}
