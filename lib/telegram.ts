import { Bot, webhookCallback, InlineKeyboard } from "grammy";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";

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

// ── /start ────────────────────────────────────────────────────────────────────
bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("📋 Müraciət et", "apply")
    .row()
    .text("ℹ️ Haqqımızda", "about");

  await ctx.reply(
    `Salam! 👋\n\nOnkodəstək platformasına xoş gəldiniz.\n\n` +
    `Biz Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf şəkildə maddi dəstək göstəririk.\n\n` +
    `Hər bir ianənin hara xərcləndiyini real vaxt rejimində izləyə bilərsiniz.\n\n` +
    `<b>Həyata dəstək ol! 💙</b>`,
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
    "🌐 sayt: onkodestek.az",
    { parse_mode: "HTML" }
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

    // DB-ə yaz
    await db.insert(patients).values({
      telegramId: userId.toString(),
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

    await ctx.reply(
      "✅ <b>Müraciətiniz qəbul edildi!</b>\n\n" +
      "Komandamız sənədlərinizi yoxladıqdan sonra sizinlə əlaqə saxlayacaq.\n\n" +
      "Adətən <b>1-3 iş günü</b> ərzində cavab verilir.\n\n" +
      "Hər hansı sualınız varsa, @onkodestek_admin ilə əlaqə saxlayın.",
      { parse_mode: "HTML" }
    );
  }
});

// ── Webhook handler ───────────────────────────────────────────────────────────
export const handleWebhook = webhookCallback(bot, "std/http");
