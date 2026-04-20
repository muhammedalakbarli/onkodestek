import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

// ── Vəziyyət idarəsi (sadə in-memory, prodda Redis istifadə et) ──────────────
const sessions = new Map<number, { step: string; data: Partial<{
  fullName: string;
  age: string;
  diagnosis: string;
  hospitalName: string;
  contactPhone: string;
  story: string;
  goalAmount: string;
}> }>();

// ── /myid — admin chat ID-sini öyrən ─────────────────────────────────────────
bot.command("myid", async (ctx) => {
  const id = ctx.from?.id ?? "naməlum";
  await ctx.reply(
    `🆔 Sizin Telegram Chat ID-niz:\n\n<code>${id}</code>\n\nBu ID-ni ADMIN_TELEGRAM_CHAT_ID olaraq Vercel-ə əlavə edin.`,
    { parse_mode: "HTML" }
  );
});

// ── /start ────────────────────────────────────────────────────────────────────
bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("📋 Yardım müraciəti", "apply")
    .row()
    .text("💙 Psixoloji dəstək", "support")
    .row()
    .text("🔍 Müraciəti izlə", "track_prompt")
    .row()
    .text("ℹ️ Haqqımızda", "about");

  await ctx.reply(
    `Salam! 👋\n\n` +
    `<b>Onkodəstək</b> platformasına xoş gəldiniz.\n\n` +
    `Biz Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə:\n` +
    `💰 Maddi dəstək\n` +
    `💙 Psixoloji dəstək\n` +
    `📊 Şəffaf hesabat\n\n` +
    `təqdim edirik.\n\n` +
    `Aşağıdan sizə lazım olan bölməni seçin:`,
    { parse_mode: "HTML", reply_markup: keyboard }
  );
});

// ── Müraciət axını ────────────────────────────────────────────────────────────
bot.callbackQuery("apply", async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from.id;
  sessions.set(userId, { step: "fullName", data: {} });

  await ctx.reply(
    "📝 <b>Müraciət forması</b>\n\nZəhmət olmasa, xəstənin <b>tam adını</b> yazın:",
    { parse_mode: "HTML" }
  );
});

bot.callbackQuery("about", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "ℹ️ <b>Onkodəstək haqqında</b>\n\n" +
    "Onkodəstək, Azərbaycanda xərçənglə mübarizə aparan xəstələrə maddi dəstək göstərən şəffaf xeyriyyə platformasıdır.\n\n" +
    "✅ Hər xəstə sənəd yoxlamasından keçir\n" +
    "✅ Hər ianə birbaşa xəstəyə çatır\n" +
    "✅ Hər xərc qəbzlə ictimaiyyətə açıqlanır\n\n" +
    "🌐 sayt: onkodestek.vercel.app",
    { parse_mode: "HTML" }
  );
});

// ── İzləmə prompt ─────────────────────────────────────────────────────────────
bot.callbackQuery("track_prompt", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "🔍 İzləmə kodunuzu yazın:\n\n<code>/izle OKD-XXXXXX</code>",
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
    "💡 <i>Hər nəfəs sizin ixtiyarınızdadır. Hazır olduğunuzda başlayın.</i>",
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("💙 Psixoloji dəstəyə qayıt", "support"),
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
    `💪 <b>Bu gün sizin üçün:</b>\n\n<i>${msg}</i>\n\n` +
    "━━━━━━━━━━━━━━━\n" +
    "Hər gün bu düyməyə basa bilərsiniz. 🌟",
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
    "Bir neçə şey etməyə çalışın:\n\n" +
    "🌿 <b>İndi, bu anda:</b>\n" +
    "Ətrafınızda 5 şeyə baxın. Onları adlandırın. Bu sizi bu ana qaytaracaq.\n\n" +
    "🤝 <b>Tək olmayın:</b>\n" +
    "Yanınızda biri varsa — əllərini tutun. Heç nə deməyə ehtiyac yoxdur.\n\n" +
    "💬 <b>Danışmaq istəyirsinizsə:</b>\n" +
    "Bizə yazın: @onkodestek_admin\n\n" +
    "📞 <b>Azərbaycan Psixoloji Yardım Xətti:</b>\n" +
    "<b>860</b> (pulsuz, 24/7)\n\n" +
    "━━━━━━━━━━━━━━━\n" +
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
    "• Fikirləri düzəltməyə çalışmayın, sadəcə yanında olun\n" +
    "• \"Güclü ol\" deməyin əvəzinə — \"Yanındayam\" deyin\n\n" +
    "✅ <b>Özünüzü qoruyun:</b>\n" +
    "• Hər gün 10 dəqiqə özünüz üçün vaxt ayırın\n" +
    "• Köməyi rədd etməyin — qəbul etmək güclülükdür\n" +
    "• Öz hisslərinizi danmayın — qorxu, kədər, yorğunluq — hamısı normaldır\n\n" +
    "✅ <b>Uşaqlara necə izah etmək:</b>\n" +
    "Yaşa uyğun sadə dillə həqiqəti söyləyin.\n" +
    "\"Baba xəstədir, həkimlər müalicə edir, biz birlikdəyik.\"\n\n" +
    "━━━━━━━━━━━━━━━\n" +
    "<i>Siz də bu mübarizənin qəhrəmanısınız.</i> 💙",
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("💙 Psixoloji dəstəyə qayıt", "support"),
    },
  );
});

// ── Mütəxəssislə əlaqə ────────────────────────────────────────────────────────
bot.callbackQuery("support_contact", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "📞 <b>Mütəxəssislə əlaqə</b>\n\n" +
    "Peşəkar psixoloji dəstək üçün müraciət edin:\n\n" +
    "🏥 <b>Milli Onkologiya Mərkəzi</b>\n" +
    "Psixologiya şöbəsi: +994 12 440-00-84\n\n" +
    "📞 <b>Azərbaycan Psixoloji Yardım Xətti</b>\n" +
    "860 (pulsuz, 24 saat, 7 gün)\n\n" +
    "💬 <b>Onkodəstək könüllü psixoloqları</b>\n" +
    "Yazın: @onkodestek_admin\n" +
    "Ən qısa zamanda cavab veririk.\n\n" +
    "━━━━━━━━━━━━━━━\n" +
    "<i>Kömək istəmək — ən doğru addımdır.</i>",
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard()
        .text("« Geri", "support"),
    },
  );
});

// ── Ana menyuya qayıt ─────────────────────────────────────────────────────────
bot.callbackQuery("back_main", async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = new InlineKeyboard()
    .text("📋 Yardım müraciəti", "apply")
    .row()
    .text("💙 Psixoloji dəstək", "support")
    .row()
    .text("🔍 Müraciəti izlə", "track_prompt")
    .row()
    .text("ℹ️ Haqqımızda", "about");

  await ctx.reply(
    "Ana menyu:",
    { reply_markup: keyboard }
  );
});

// ── Axın mesajları ─────────────────────────────────────────────────────────────
bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id;
  const session = sessions.get(userId);
  if (!session) return;

  const text = ctx.message.text.trim();
  const { step, data } = session;

  if (step === "fullName") {
    data.fullName = text;
    session.step = "age";
    await ctx.reply("Xəstənin <b>yaşını</b> yazın (məs: 45):", { parse_mode: "HTML" });

  } else if (step === "age") {
    if (isNaN(parseInt(text))) {
      await ctx.reply("Zəhmət olmasa düzgün bir rəqəm yazın:");
      return;
    }
    data.age = text;
    session.step = "diagnosis";
    await ctx.reply("Xəstənin <b>diaqnozunu</b> yazın:", { parse_mode: "HTML" });

  } else if (step === "diagnosis") {
    data.diagnosis = text;
    session.step = "hospitalName";
    await ctx.reply("Müalicə olunan <b>xəstəxananın adını</b> yazın:", { parse_mode: "HTML" });

  } else if (step === "hospitalName") {
    data.hospitalName = text;
    session.step = "contactPhone";
    await ctx.reply("Əlaqə üçün <b>telefon nömrəsini</b> yazın (məs: +994501234567):", { parse_mode: "HTML" });

  } else if (step === "contactPhone") {
    data.contactPhone = text;
    session.step = "story";
    await ctx.reply(
      "Xəstənin <b>hekayəsini</b> qısaca yazın — bu mətn saytda ictimaiyyətə göstəriləcək:",
      { parse_mode: "HTML" }
    );

  } else if (step === "story") {
    data.story = text;
    session.step = "goalAmount";
    await ctx.reply(
      "Ehtiyac duyulan <b>məbləği</b> yazın (yalnız rəqəm, AZN ilə, məs: 2500):",
      { parse_mode: "HTML" }
    );

  } else if (step === "goalAmount") {
    const amount = parseFloat(text.replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      await ctx.reply("Zəhmət olmasa düzgün məbləğ yazın (məs: 2500):");
      return;
    }
    data.goalAmount = amount.toString();

    // Track ID yarat: OKD-XXXXXX (6 simvol, böyük hərf + rəqəm)
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let suffix = "";
    for (let i = 0; i < 6; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    const trackId = `OKD-${suffix}`;

    // DB-ə yaz
    await db.insert(patients).values({
      telegramId: userId.toString(),
      trackId,
      fullName: data.fullName!,
      age: parseInt(data.age!),
      diagnosis: data.diagnosis!,
      hospitalName: data.hospitalName,
      contactPhone: data.contactPhone,
      story: data.story,
      goalAmount: data.goalAmount,
      status: "pending",
    });

    sessions.delete(userId);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

    await ctx.reply(
      "✅ <b>Müraciətiniz qəbul edildi!</b>\n\n" +
      `🔑 <b>İzləmə kodunuz:</b> <code>${trackId}</code>\n\n` +
      "Bu kodu saxlayın — müraciətinizin statusunu izləmək üçün lazım olacaq.\n\n" +
      `🔗 İzləmə linki: ${appUrl}/track?id=${trackId}\n\n` +
      "Komandamız sənədlərinizi yoxladıqdan sonra sizinlə əlaqə saxlayacaq.\n" +
      "Adətən <b>1-3 iş günü</b> ərzində cavab verilir.",
      { parse_mode: "HTML" }
    );
  }
});

// ── /izle <kod> — müraciət statusunu yoxla ────────────────────────────────────
bot.command("izle", async (ctx) => {
  const arg = ctx.match?.trim().toUpperCase();
  if (!arg) {
    await ctx.reply(
      "Zəhmət olmasa izləmə kodunuzu yazın:\n<code>/izle OKD-XXXXXX</code>",
      { parse_mode: "HTML" }
    );
    return;
  }

  const [p] = await db
    .select()
    .from(patients)
    .where(eq(patients.trackId, arg))
    .limit(1);

  if (!p) {
    await ctx.reply(`❌ <b>${arg}</b> koduna uyğun müraciət tapılmadı.`, { parse_mode: "HTML" });
    return;
  }

  const statusEmoji: Record<string, string> = {
    pending:  "⏳ Gözləyir",
    verified: "✅ Sənəd yoxlandı",
    active:   "🟢 Aktiv yığım",
    funded:   "🎉 Tam maliyyələşdi",
    closed:   "🔒 Bağlandı",
  };

  const collected = parseFloat(p.collectedAmount as string);
  const goal      = parseFloat(p.goalAmount as string);
  const percent   = goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : 0;
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

  await ctx.reply(
    `📋 <b>Müraciət: ${p.trackId}</b>\n\n` +
    `👤 ${p.fullName}\n` +
    `🏥 ${p.hospitalName ?? "—"}\n` +
    `📊 Status: ${statusEmoji[p.status] ?? p.status}\n\n` +
    `💰 Yığılan: <b>${collected.toLocaleString("az-AZ")} ₼</b> / ${goal.toLocaleString("az-AZ")} ₼ (${percent}%)\n\n` +
    `🔗 ${appUrl}/track?id=${p.trackId}`,
    { parse_mode: "HTML" }
  );
});

// ── Webhook handler ───────────────────────────────────────────────────────────
export const handleWebhook = webhookCallback(bot, "std/http");
