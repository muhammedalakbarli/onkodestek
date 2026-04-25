import { NextRequest, NextResponse } from "next/server";

const APP = "https://onkodestek.vercel.app";

const MOTIVATIONAL = [
  "Hər gün sabahdan güclüsünüz. Bu mübarizə sizi qırır, amma sındırmır. 💙",
  "Ümid — ən güclü dərmandır. Siz hər gün onu seçirsiniz.",
  "Xəstəlik bədəninizə toxunur, amma ruhunuzu yalnız siz idarə edirsiniz.",
  "Bu yol ağırdır. Amma siz tək deyilsiniz — hər addımda yanınızdayıq.",
  "Güclü insan qorxmayan deyil, qorxsa da irəliləyəndir. Siz o gücsünüz.",
  "Bugün cəmi bir addım at — sabah onu mükəmməl hesab edəcəksən.",
  "Mübarizə aparmaq — artıq qəhrəmanlıqdır. Sizdən razıyıq.",
  "Bəzən ən böyük cəsarət — səhər yuxudan qalxmaqdır. Bu da cəsarətdir.",
];

function tg(token: string) {
  return `https://api.telegram.org/bot${token}`;
}

async function sendMessage(token: string, chatId: number, text: string, extra: Record<string, unknown> = {}) {
  await fetch(`${tg(token)}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", ...extra }),
  });
}

async function answerCbq(token: string, id: string) {
  await fetch(`${tg(token)}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: id }),
  });
}

function kb(...rows: { text: string; callback_data?: string; url?: string }[][]) {
  return { inline_keyboard: rows.map(row => row.map(btn => btn.url ? { text: btn.text, url: btn.url } : { text: btn.text, callback_data: btn.callback_data })) };
}

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ ok: true });

  let update: Record<string, unknown>;
  try { update = await req.json(); }
  catch { return NextResponse.json({ ok: true }); }

  // ── Mesaj ──────────────────────────────────────────────────────────────────
  const msg = (update.message ?? update.edited_message) as Record<string, unknown> | undefined;
  if (msg) {
    const chatId = (msg.chat as Record<string, unknown>).id as number;
    const text = (msg.text as string | undefined) ?? "";

    if (text.startsWith("/start")) {
      await sendMessage(token, chatId,
        `Salam! 👋\n\n<b>OnkoDəstək</b> platformasına xoş gəldiniz.\n\n` +
        `Biz Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə:\n` +
        `💰 Maddi dəstək\n💙 Psixoloji dəstək\n📊 Şəffaf hesabat\n\ntəqdim edirik.`,
        { reply_markup: kb(
          [{ text: "📋 Yardım müraciəti", url: `${APP}/apply` }],
          [{ text: "💙 Psixoloji dəstək", callback_data: "support" }],
          [{ text: "🔍 Müraciəti izlə", callback_data: "track_prompt" }],
          [{ text: "🔔 Bildirişlərə abunə ol", callback_data: "subscribe" }],
          [{ text: "ℹ️ Haqqımızda", callback_data: "about" }],
        )}
      );

    } else if (text.startsWith("/abune")) {
      try {
        const { db } = await import("@/lib/db");
        const { botSessions } = await import("@/drizzle/schema");
        const key = `subscriber:${chatId}`;
        await db.insert(botSessions).values({ key, value: "1", updatedAt: new Date() })
          .onConflictDoUpdate({ target: botSessions.key, set: { value: "1", updatedAt: new Date() } });
        await sendMessage(token, chatId,
          `🔔 Abunə oldunuz!\n\nYeni xəstə əlavə olunanda sizə bildiriş göndərəcəyik.`
        );
      } catch {
        await sendMessage(token, chatId, `🔔 Abunəlik qeydə alındı!`);
      }

    } else if (text.startsWith("/izle ")) {
      const trackId = text.slice(6).trim().toUpperCase();
      try {
        const { db } = await import("@/lib/db");
        const { patients } = await import("@/drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const [p] = await db.select().from(patients).where(eq(patients.trackId, trackId)).limit(1);
        if (!p) {
          await sendMessage(token, chatId, `❌ <b>${trackId}</b> koduna uyğun müraciət tapılmadı.`);
        } else {
          const collected = parseFloat(String(p.collectedAmount));
          const goal = parseFloat(String(p.goalAmount));
          const pct = goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : 0;
          const statusLabel: Record<string, string> = {
            pending: "⏳ Gözləyir", verified: "✅ Sənəd yoxlandı",
            active: "🟢 Aktiv yığım", funded: "🎉 Tam maliyyələşdi", closed: "🔒 Bağlandı",
          };
          await sendMessage(token, chatId,
            `📋 <b>${p.trackId}</b>\n\n👤 ${p.fullName}\n🏥 ${p.hospitalName ?? "—"}\n` +
            `📊 ${statusLabel[p.status] ?? p.status}\n\n` +
            `💰 ${collected.toLocaleString("az-AZ")} ₼ / ${goal.toLocaleString("az-AZ")} ₼ (${pct}%)\n\n` +
            `🔗 ${APP}/track?id=${p.trackId}`
          );
        }
      } catch {
        await sendMessage(token, chatId, `🔍 ${APP}/track?id=${trackId}`);
      }

    } else if (text.startsWith("/myid")) {
      await sendMessage(token, chatId, `🆔 Chat ID: <code>${chatId}</code>`);

    } else {
      await sendMessage(token, chatId,
        `📋 Yardım müraciəti üçün:\n${APP}/apply\n\n📊 Müraciəti izləmək: /izle OKD-XXXXXX`,
        { reply_markup: kb([{ text: "💙 Psixoloji dəstək", callback_data: "support" }]) }
      );
    }
  }

  // ── Callback query ─────────────────────────────────────────────────────────
  const cq = update.callback_query as Record<string, unknown> | undefined;
  if (cq) {
    await answerCbq(token, cq.id as string);
    const chatId = ((cq.message as Record<string, unknown>)?.chat as Record<string, unknown>)?.id as number;
    const data = (cq.data as string | undefined) ?? "";

    if (!chatId) return NextResponse.json({ ok: true });

    if (data === "subscribe") {
      try {
        const { db } = await import("@/lib/db");
        const { botSessions } = await import("@/drizzle/schema");
        const key = `subscriber:${chatId}`;
        await db.insert(botSessions).values({ key, value: "1", updatedAt: new Date() })
          .onConflictDoUpdate({ target: botSessions.key, set: { value: "1", updatedAt: new Date() } });
      } catch {}
      await sendMessage(token, chatId,
        `🔔 <b>Abunə oldunuz!</b>\n\nYeni xəstə əlavə olunanda sizə bildiriş göndərəcəyik.\n\nAbunəliyi dayandırmaq: /abune_sil`
      );

    } else if (data === "about") {
      await sendMessage(token, chatId,
        `ℹ️ <b>OnkoDəstək haqqında</b>\n\n` +
        `✅ Hər xəstə sənəd yoxlamasından keçir\n` +
        `✅ Hər ianə birbaşa xəstəyə çatır\n` +
        `✅ Hər xərc qəbzlə ictimaiyyətə açıqlanır\n\n` +
        `🌐 ${APP}`,
        { reply_markup: kb([{ text: "« Geri", callback_data: "back_main" }]) }
      );

    } else if (data === "track_prompt") {
      await sendMessage(token, chatId,
        `🔍 İzləmə kodunuzu yazın:\n\n<code>/izle OKD-XXXXXX</code>\n\nVə ya saytda: ${APP}/track`
      );

    } else if (data === "support") {
      await sendMessage(token, chatId,
        `💙 <b>Psixoloji Dəstək</b>\n\nXərçənglə mübarizə aparmaq — yalnız bədənin deyil, ruhun da sınanmasıdır.\n\nBu anda necə hiss etdiyinizi seçin:`,
        { reply_markup: kb(
          [{ text: "🌬️ Nəfəs məşqi", callback_data: "support_breathe" }],
          [{ text: "💪 Güc ver mənə", callback_data: "support_motivate" }],
          [{ text: "😔 Çox pis hiss edirəm", callback_data: "support_crisis" }],
          [{ text: "👨‍👩‍👧 Ailə üçün məsləhət", callback_data: "support_family" }],
          [{ text: "📞 Mütəxəssislə əlaqə", callback_data: "support_contact" }],
          [{ text: "« Geri", callback_data: "back_main" }],
        )}
      );

    } else if (data === "support_breathe") {
      await sendMessage(token, chatId,
        `🌬️ <b>4-7-8 Nəfəs Məşqi</b>\n\nSakit bir yerdə oturun:\n\n` +
        `1️⃣ Burnunuzdan <b>4 saniyə</b> nəfəs alın\n` +
        `2️⃣ Nəfəsinizi <b>7 saniyə</b> tutun\n` +
        `3️⃣ Ağzınızdan <b>8 saniyə</b> nəfəs verin\n\n` +
        `Bu dövrü <b>4 dəfə</b> təkrarlayın.\n\n<i>Hər nəfəs sizin ixtiyarınızdadır.</i>`,
        { reply_markup: kb([{ text: "💙 Psixoloji dəstəyə qayıt", callback_data: "support" }]) }
      );

    } else if (data === "support_motivate") {
      const m = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];
      await sendMessage(token, chatId,
        `💪 <b>Bu gün sizin üçün:</b>\n\n<i>${m}</i>`,
        { reply_markup: kb(
          [{ text: "🔄 Başqa birini göstər", callback_data: "support_motivate" }],
          [{ text: "« Geri", callback_data: "support" }],
        )}
      );

    } else if (data === "support_crisis") {
      await sendMessage(token, chatId,
        `😔 <b>Sizinlə birlikdəyik.</b>\n\nPis hiss etmək — tamamilə normaldır.\n\n` +
        `🌿 <b>İndi, bu anda:</b>\nƏtrafınızda 5 şeyə baxın. Onları adlandırın.\n\n` +
        `🤝 Yanınızda biri varsa — əllərini tutun.\n\n` +
        `📞 <b>Psixoloji Yardım Xətti:</b> <b>860</b> (pulsuz, 24/7)\n\n` +
        `<i>Siz bu mübarizəyə layiqsiniz. Biz buradayıq.</i> 💙`,
        { reply_markup: kb(
          [{ text: "🌬️ Nəfəs məşqi et", callback_data: "support_breathe" }],
          [{ text: "💪 Güc ver mənə", callback_data: "support_motivate" }],
          [{ text: "« Geri", callback_data: "support" }],
        )}
      );

    } else if (data === "support_family") {
      await sendMessage(token, chatId,
        `👨‍👩‍👧 <b>Ailə üçün məsləhət</b>\n\n` +
        `✅ <b>Xəstənizlə necə danışmalı:</b>\n• \"Nə hiss edirsən?\" — soruşun, dinləyin\n• \"Güclü ol\" əvəzinə — \"Yanındayam\" deyin\n\n` +
        `✅ <b>Özünüzü qoruyun:</b>\n• Hər gün 10 dəqiqə özünüz üçün vaxt ayırın\n• Köməyi rədd etməyin\n\n` +
        `<i>Siz də bu mübarizənin qəhrəmanısınız.</i> 💙`,
        { reply_markup: kb([{ text: "💙 Psixoloji dəstəyə qayıt", callback_data: "support" }]) }
      );

    } else if (data === "support_contact") {
      await sendMessage(token, chatId,
        `📞 <b>Mütəxəssislə əlaqə</b>\n\n` +
        `🏥 <b>Milli Onkologiya Mərkəzi</b>\n+994 12 440-00-84\n\n` +
        `📞 <b>Psixoloji Yardım Xətti</b>\n860 (pulsuz, 24/7)\n\n` +
        `💬 <b>Könüllü psixoloqlar:</b> @onkodestek_admin`,
        { reply_markup: kb([{ text: "« Geri", callback_data: "support" }]) }
      );

    } else if (data === "back_main") {
      await sendMessage(token, chatId, "Ana menyu:",
        { reply_markup: kb(
          [{ text: "📋 Yardım müraciəti", url: `${APP}/apply` }],
          [{ text: "💙 Psixoloji dəstək", callback_data: "support" }],
          [{ text: "🔍 Müraciəti izlə", callback_data: "track_prompt" }],
          [{ text: "ℹ️ Haqqımızda", callback_data: "about" }],
        )}
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: true, bot: "onkodestek" });
}
