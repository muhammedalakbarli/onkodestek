/**
 * Lokal inkişaf üçün Telegram botu polling rejimində işlədir.
 * Produksiyada bu skript lazım deyil — webhook istifadə olunur.
 *
 * İstifadə: npx tsx scripts/bot-polling.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { Bot, InlineKeyboard } from "grammy";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../drizzle/schema";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

// ── Vəziyyət idarəsi ──────────────────────────────────────────────────────────
const sessions = new Map<number, {
  step: string;
  data: Partial<{
    fullName: string;
    age: string;
    diagnosis: string;
    hospitalName: string;
    contactPhone: string;
    story: string;
    goalAmount: string;
  }>;
}>();

// ── /start ────────────────────────────────────────────────────────────────────
bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("📋 Müraciət et", "apply")
    .row()
    .text("ℹ️ Haqqımızda", "about");

  await ctx.reply(
    `Salam! 👋\n\n` +
    `<b>Onkodəstək</b> platformasına xoş gəldiniz.\n\n` +
    `Biz Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf şəkildə maddi dəstək göstəririk.\n\n` +
    `Hər bir ianənin hara xərcləndiyini real vaxt rejimində izləyə bilərsiniz.\n\n` +
    `<b>💙 Həyata dəstək ol!</b>`,
    { parse_mode: "HTML", reply_markup: keyboard }
  );
});

// ── Müraciət düyməsi ──────────────────────────────────────────────────────────
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
    `ℹ️ <b>Onkodəstək haqqında</b>\n\n` +
    `Onkodəstək, Azərbaycanda xərçənglə mübarizə aparan xəstələrə maddi dəstək göstərən şəffaf xeyriyyə platformasıdır.\n\n` +
    `✅ Hər xəstə sənəd yoxlamasından keçir\n` +
    `✅ Hər ianə birbaşa xəstəyə çatır\n` +
    `✅ Hər xərc qəbzlə ictimaiyyətə açıqlanır\n\n` +
    `🌐 <b>onkodestek.az</b>`,
    { parse_mode: "HTML" }
  );
});

// ── Axın mesajları ─────────────────────────────────────────────────────────────
bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id;
  const session = sessions.get(userId);
  if (!session) {
    // Sessiyanı olmayan istifadəçiyə start göndər
    await ctx.reply(
      "Zəhmət olmasa /start yazın və müraciət prosesinə başlayın."
    );
    return;
  }

  const text = ctx.message.text.trim();
  const { step, data } = session;

  if (step === "fullName") {
    if (text.length < 3) {
      await ctx.reply("Ad çox qısadır. Zəhmət olmasa tam adı yazın:");
      return;
    }
    data.fullName = text;
    session.step = "age";
    await ctx.reply(
      "Xəstənin <b>yaşını</b> yazın (məs: 45):",
      { parse_mode: "HTML" }
    );

  } else if (step === "age") {
    const age = parseInt(text);
    if (isNaN(age) || age < 1 || age > 120) {
      await ctx.reply("Zəhmət olmasa düzgün yaş yazın (məs: 45):");
      return;
    }
    data.age = text;
    session.step = "diagnosis";
    await ctx.reply(
      "Xəstənin <b>diaqnozunu</b> yazın (məs: Döş xərçəngi III mərhələ):",
      { parse_mode: "HTML" }
    );

  } else if (step === "diagnosis") {
    if (text.length < 3) {
      await ctx.reply("Diaqnozu daha ətraflı yazın:");
      return;
    }
    data.diagnosis = text;
    session.step = "hospitalName";
    await ctx.reply(
      "Müalicə olunan <b>xəstəxananın adını</b> yazın:",
      { parse_mode: "HTML" }
    );

  } else if (step === "hospitalName") {
    data.hospitalName = text;
    session.step = "contactPhone";
    await ctx.reply(
      "Əlaqə üçün <b>telefon nömrəsini</b> yazın (məs: +994501234567):",
      { parse_mode: "HTML" }
    );

  } else if (step === "contactPhone") {
    data.contactPhone = text;
    session.step = "story";
    await ctx.reply(
      "Xəstənin <b>hekayəsini</b> qısaca yazın.\n\nBu mətn saytda ictimaiyyətə göstəriləcək — ianəçilərin qərar vermə-sinə kömək edəcək:",
      { parse_mode: "HTML" }
    );

  } else if (step === "story") {
    if (text.length < 20) {
      await ctx.reply("Hekayəni bir az daha ətraflı yazın (minimum 20 hərf):");
      return;
    }
    data.story = text;
    session.step = "goalAmount";
    await ctx.reply(
      "Ehtiyac duyulan <b>məbləği AZN ilə</b> yazın (yalnız rəqəm, məs: 2500):",
      { parse_mode: "HTML" }
    );

  } else if (step === "goalAmount") {
    const amount = parseFloat(text.replace(",", "."));
    if (isNaN(amount) || amount < 50) {
      await ctx.reply("Zəhmət olmasa düzgün məbləğ yazın (minimum 50 AZN, məs: 2500):");
      return;
    }
    data.goalAmount = amount.toFixed(2);

    // DB-ə yaz
    await db.insert(schema.patients).values({
      telegramId: userId.toString(),
      fullName: data.fullName!,
      age: parseInt(data.age!),
      diagnosis: data.diagnosis!,
      hospitalName: data.hospitalName,
      contactPhone: data.contactPhone,
      story: data.story,
      goalAmount: data.goalAmount,
      status: "pending",
      isPublic: false,
    });

    sessions.delete(userId);

    await ctx.reply(
      `✅ <b>Müraciətiniz qəbul edildi!</b>\n\n` +
      `📋 <b>Xülasə:</b>\n` +
      `• Ad: ${data.fullName}\n` +
      `• Diaqnoz: ${data.diagnosis}\n` +
      `• Tələb olunan məbləğ: ${data.goalAmount} AZN\n\n` +
      `Komandamız sənədlərinizi yoxladıqdan sonra sizinlə əlaqə saxlayacaq.\n` +
      `Adətən <b>1-3 iş günü</b> ərzində cavab verilir.\n\n` +
      `❓ Suallarınız üçün: @onkodestek_admin`,
      { parse_mode: "HTML" }
    );

    console.log(`Yeni müraciət: ${data.fullName} (Telegram ID: ${userId})`);
  }
});

// ── Botun adını yenilə ────────────────────────────────────────────────────────
async function setupBot() {
  await bot.api.setMyDescription(
    "Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf xeyriyyəçilik platforması. Hər ianənin hara getdiyini real vaxt rejimində izləyin."
  );

  await bot.api.setMyShortDescription(
    "Şəffaf onkoloji yardım platforması 💙"
  );

  await bot.api.setMyCommands([
    { command: "start", description: "Botu başlat / Ana menyu" },
  ]);

  console.log("Bot parametrləri yeniləndi.");
}

// ── Başlat ─────────────────────────────────────────────────────────────────────
console.log("🤖 OnkoDestek botu polling rejimində başlayır...");
console.log(`📡 Bot: @OnkoDestek_bot`);

setupBot().then(() => {
  bot.start({
    onStart: (info) => {
      console.log(`✅ Bot işləyir: @${info.username}`);
      console.log("Dayandırmaq üçün Ctrl+C basın.");
    },
  });
}).catch((err) => {
  console.error("Bot başlamadı:", err);
  process.exit(1);
});
