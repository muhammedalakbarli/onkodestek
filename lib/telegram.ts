import { Bot, InlineKeyboard } from "grammy";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN ?? "placeholder");

// Bütün handler xətaları log-a yazılsın
bot.catch((err) => {
  console.error("Bot handler xətası:", err.message, err.ctx?.update);
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

// ── /myid — admin chat ID-sini öyrən ─────────────────────────────────────────
bot.command("myid", async (ctx) => {
  const id = ctx.from?.id ?? "naməlum";
  await ctx.reply(
    `🆔 Sizin Telegram Chat ID-niz:\n\n<code>${id}</code>`,
    { parse_mode: "HTML" }
  );
});

// ── /start ────────────────────────────────────────────────────────────────────
bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .url("📋 Yardım müraciəti", `${APP_URL}/apply`)
    .row()
    .text("💙 Psixoloji dəstək", "support")
    .row()
    .text("🔍 Müraciəti izlə", "track_prompt")
    .row()
    .text("ℹ️ Haqqımızda", "about");

  await ctx.reply(
    `Salam! 👋\n\n` +
    `<b>OnkoDəstək</b> platformasına xoş gəldiniz.\n\n` +
    `Biz Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə:\n` +
    `💰 Maddi dəstək\n` +
    `💙 Psixoloji dəstək\n` +
    `📊 Şəffaf hesabat\n\n` +
    `təqdim edirik.\n\n` +
    `Yardım müraciəti üçün saytımıza daxil olun 👆`,
    { parse_mode: "HTML", reply_markup: keyboard }
  );
});

// ── Haqqımızda ────────────────────────────────────────────────────────────────
bot.callbackQuery("about", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "ℹ️ <b>OnkoDəstək haqqında</b>\n\n" +
    "OnkoDəstək, Azərbaycanda xərçənglə mübarizə aparan xəstələrə maddi dəstək göstərən şəffaf xeyriyyə platformasıdır.\n\n" +
    "✅ Hər xəstə sənəd yoxlamasından keçir\n" +
    "✅ Hər ianə birbaşa xəstəyə çatır\n" +
    "✅ Hər xərc qəbzlə ictimaiyyətə açıqlanır\n\n" +
    `🌐 Sayt: ${APP_URL}`,
    { parse_mode: "HTML" }
  );
});

// ── İzləmə prompt ─────────────────────────────────────────────────────────────
bot.callbackQuery("track_prompt", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    `🔍 İzləmə kodunuzu yazın:\n\n<code>/izle OKD-XXXXXX</code>\n\nVə ya saytda izləyin:\n${APP_URL}/track`,
    { parse_mode: "HTML" }
  );
});

// ── Psixoloji dəstək ana menyu ────────────────────────────────────────────────
bot.callbackQuery("support", async (ctx) => {
  await ctx.answerCallbackQuery();

  const keyboard = new InlineKeyboard()
    .text("🌬️ Nəfəs məşqi", "support_breathe")
    .row()
    .text("💪 Güc ver mənə", "support_motivate")
    .row()
    .text("😔 Çox pis hiss edirəm", "support_crisis")
    .row()
    .text("👨‍👩‍👧 Ailə üçün məsləhət", "support_family")
    .row()
    .text("📞 Mütəxəssislə əlaqə", "support_contact")
    .row()
    .text("« Geri", "back_main");

  await ctx.reply(
    "💙 <b>Psixoloji Dəstək</b>\n\n" +
    "Xərçənglə mübarizə aparmaq — yalnız bədənin deyil, ruhun da sınanmasıdır.\n\n" +
    "Bu anda necə hiss etdiyinizi seçin:",
    { parse_mode: "HTML", reply_markup: keyboard }
  );
});

// ── Nəfəs məşqi ───────────────────────────────────────────────────────────────
bot.callbackQuery("support_breathe", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "🌬️ <b>4-7-8 Nəfəs Məşqi</b>\n\n" +
    "Bu məşq narahatlığı azaltmaq üçün effektivdir. Sakit bir yerdə oturun:\n\n" +
    "1️⃣ Burnunuzdan <b>4 saniyə</b> nəfəs alın\n\n" +
    "2️⃣ Nəfəsinizi <b>7 saniyə</b> tutun\n\n" +
    "3️⃣ Ağzınızdan <b>8 saniyə</b> nəfəs verin\n\n" +
    "Bu dövrü <b>4 dəfə</b> təkrarlayın.\n\n" +
    "━━━━━━━━━━━━━━━\n" +
    "💡 <i>Hər nəfəs sizin ixtiyarınızdadır.</i>",
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text("💙 Psixoloji dəstəyə qayıt", "support"),
    },
  );
});

// ── Motivasiya ────────────────────────────────────────────────────────────────
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

bot.callbackQuery("support_motivate", async (ctx) => {
  await ctx.answerCallbackQuery();
  const msg = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];
  await ctx.reply(
    `💪 <b>Bu gün sizin üçün:</b>\n\n<i>${msg}</i>`,
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("🔄 Başqa birini göstər", "support_motivate")
        .row()
        .text("« Geri", "support"),
    },
  );
});

// ── Böhran dəstəyi ────────────────────────────────────────────────────────────
bot.callbackQuery("support_crisis", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "😔 <b>Sizinlə birlikdəyik.</b>\n\n" +
    "Pis hiss etmək — tamamilə normaldır. Bu xəstəlik çox ağırdır və hissləriniz əsaslıdır.\n\n" +
    "🌿 <b>İndi, bu anda:</b>\n" +
    "Ətrafınızda 5 şeyə baxın. Onları adlandırın. Bu sizi bu ana qaytaracaq.\n\n" +
    "🤝 <b>Tək olmayın:</b>\n" +
    "Yanınızda biri varsa — əllərini tutun.\n\n" +
    "💬 <b>Danışmaq istəyirsinizsə:</b>\n" +
    "Bizə yazın: @onkodestek_admin\n\n" +
    "📞 <b>Azərbaycan Psixoloji Yardım Xətti:</b>\n" +
    "<b>860</b> (pulsuz, 24/7)\n\n" +
    "<i>Siz bu mübarizəyə layiqsiniz. Biz buradayıq.</i> 💙",
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("🌬️ Nəfəs məşqi et", "support_breathe")
        .row()
        .text("💪 Güc ver mənə", "support_motivate")
        .row()
        .text("« Geri", "support"),
    },
  );
});

// ── Ailə üçün məsləhət ────────────────────────────────────────────────────────
bot.callbackQuery("support_family", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "👨‍👩‍👧 <b>Ailə üçün məsləhət</b>\n\n" +
    "Yaxın birinin xəstəliyini yaşamaq da çox ağırdır. Özünüzü unutmayın.\n\n" +
    "✅ <b>Xəstənizlə necə danışmalı:</b>\n" +
    "• \"Nə hiss edirsən?\" — soruşun, dinləyin\n" +
    "• \"Güclü ol\" deməyin əvəzinə — \"Yanındayam\" deyin\n\n" +
    "✅ <b>Özünüzü qoruyun:</b>\n" +
    "• Hər gün 10 dəqiqə özünüz üçün vaxt ayırın\n" +
    "• Köməyi rədd etməyin — qəbul etmək güclülükdür\n\n" +
    "<i>Siz də bu mübarizənin qəhrəmanısınız.</i> 💙",
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text("💙 Psixoloji dəstəyə qayıt", "support"),
    },
  );
});

// ── Mütəxəssislə əlaqə ────────────────────────────────────────────────────────
bot.callbackQuery("support_contact", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "📞 <b>Mütəxəssislə əlaqə</b>\n\n" +
    "🏥 <b>Milli Onkologiya Mərkəzi</b>\n" +
    "Psixologiya şöbəsi: +994 12 440-00-84\n\n" +
    "📞 <b>Azərbaycan Psixoloji Yardım Xətti</b>\n" +
    "860 (pulsuz, 24 saat, 7 gün)\n\n" +
    "💬 <b>OnkoDəstək könüllü psixoloqları</b>\n" +
    "Yazın: @onkodestek_admin\n\n" +
    "<i>Kömək istəmək — ən doğru addımdır.</i>",
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text("« Geri", "support"),
    },
  );
});

// ── Ana menyuya qayıt ─────────────────────────────────────────────────────────
bot.callbackQuery("back_main", async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = new InlineKeyboard()
    .url("📋 Yardım müraciəti", `${APP_URL}/apply`)
    .row()
    .text("💙 Psixoloji dəstək", "support")
    .row()
    .text("🔍 Müraciəti izlə", "track_prompt")
    .row()
    .text("ℹ️ Haqqımızda", "about");

  await ctx.reply("Ana menyu:", { reply_markup: keyboard });
});

// ── /izle <kod> — müraciət statusunu yoxla ────────────────────────────────────
bot.command("izle", async (ctx) => {
  const arg = ctx.match?.trim().toUpperCase();
  if (!arg) {
    await ctx.reply(
      `Zəhmət olmasa izləmə kodunuzu yazın:\n<code>/izle OKD-XXXXXX</code>\n\nVə ya saytda: ${APP_URL}/track`,
      { parse_mode: "HTML" }
    );
    return;
  }

  try {
    const [p] = await db
      .select()
      .from(patients)
      .where(eq(patients.trackId, arg))
      .limit(1);

    if (!p) {
      await ctx.reply(`❌ <b>${arg}</b> koduna uyğun müraciət tapılmadı.`, { parse_mode: "HTML" });
      return;
    }

    const statusLabel: Record<string, string> = {
      pending:  "⏳ Gözləyir",
      verified: "✅ Sənəd yoxlandı",
      active:   "🟢 Aktiv yığım",
      funded:   "🎉 Tam maliyyələşdi",
      closed:   "🔒 Bağlandı",
    };

    const collected = parseFloat(p.collectedAmount as string);
    const goal      = parseFloat(p.goalAmount as string);
    const percent   = goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : 0;

    await ctx.reply(
      `📋 <b>Müraciət: ${p.trackId}</b>\n\n` +
      `👤 ${p.fullName}\n` +
      `🏥 ${p.hospitalName ?? "—"}\n` +
      `📊 Status: ${statusLabel[p.status] ?? p.status}\n\n` +
      `💰 Yığılan: <b>${collected.toLocaleString("az-AZ")} ₼</b> / ${goal.toLocaleString("az-AZ")} ₼ (${percent}%)\n\n` +
      `🔗 ${APP_URL}/track?id=${p.trackId}`,
      { parse_mode: "HTML" }
    );
  } catch {
    await ctx.reply("Xəta baş verdi. Bir az sonra yenidən cəhd edin.");
  }
});

// bot artıq yuxarıda export const bot = new Bot(...) olaraq ixrac edilib
