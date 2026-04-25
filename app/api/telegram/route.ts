import { NextRequest, NextResponse } from "next/server";

// Token funksiya içindən oxunur — module init vaxtı undefined ola bilər
function api() {
  return `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
}

async function send(chatId: number, text: string) {
  const res = await fetch(`${api()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  const json = await res.json();
  if (!json.ok) console.error("sendMessage failed:", json);
  return json;
}

export async function POST(req: NextRequest) {
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (configuredSecret) {
    const incoming = req.headers.get("x-telegram-bot-api-secret-token");
    if (incoming !== configuredSecret) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  console.log("TG update received:", JSON.stringify(update).slice(0, 300));

  // Mesaj gəlib
  const msg = update.message as Record<string, unknown> | undefined;
  if (msg) {
    const chatId = (msg.chat as Record<string, unknown>).id as number;
    const text = (msg.text as string | undefined) ?? "";

    if (text.startsWith("/start")) {
      await send(chatId,
        `Salam! 👋\n\n<b>Onkodəstək</b> platformasına xoş gəldiniz.\n\n` +
        `Biz Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf şəkildə maddi dəstək göstəririk.\n\n` +
        `💙 Yardım üçün saytımıza keçin: https://onkodestek.vercel.app/apply\n\n` +
        `📊 Müraciəti izləmək: /izle OKD-XXXXXX`
      );
    } else if (text.startsWith("/izle ")) {
      const trackId = text.slice(6).trim().toUpperCase();
      await send(chatId, `🔍 <b>${trackId}</b> izlənir...\n\nSaytda izləyin: https://onkodestek.vercel.app/track?id=${trackId}`);
    } else if (text.startsWith("/myid")) {
      await send(chatId, `🆔 Sizin Chat ID: <code>${chatId}</code>`);
    } else {
      await send(chatId,
        `📋 Yardım müraciəti üçün:\nhttps://onkodestek.vercel.app/apply\n\n` +
        `📊 Müraciəti izləmək: /izle OKD-XXXXXX`
      );
    }
  }

  // Callback query
  const cq = update.callback_query as Record<string, unknown> | undefined;
  if (cq) {
    const chatId = ((cq.message as Record<string, unknown>)?.chat as Record<string, unknown>)?.id as number;
    const data = cq.data as string | undefined;

    // Callback-i cavabla
    await fetch(`${api()}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: cq.id }),
    });

    if (data === "about" && chatId) {
      await send(chatId,
        `ℹ️ <b>Onkodəstək haqqında</b>\n\n` +
        `✅ Hər xəstə sənəd yoxlamasından keçir\n` +
        `✅ Hər ianə birbaşa xəstəyə çatır\n` +
        `✅ Hər xərc qəbzlə ictimaiyyətə açıqlanır\n\n` +
        `🌐 https://onkodestek.vercel.app`
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: true, bot: "onkodestek" });
}
