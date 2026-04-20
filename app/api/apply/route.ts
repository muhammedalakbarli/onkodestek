import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";
import { bot } from "@/lib/telegram";
import { rateLimit } from "@/lib/rateLimit";

function generateTrackId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `OKD-${suffix}`;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok } = rateLimit(ip);
  if (!ok) {
    return NextResponse.json(
      { error: "Çox sayda müraciət. Bir saat sonra yenidən cəhd edin." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Honeypot: botlar bu sahəni doldurur, insanlar doldurmur
    if (body._trap) {
      return NextResponse.json({ trackId: "OKD-FAKE00" }); // bot saydırma
    }

    const {
      fullName, age, diagnosis, hospitalName,
      contactPhone, story, goalAmount,
      applicantName, relation, documentUrl,
    } = body;

    if (!fullName || !diagnosis || !goalAmount || !contactPhone) {
      return NextResponse.json({ error: "Məcburi sahələr boşdur" }, { status: 400 });
    }

    const amount = parseFloat(goalAmount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Məbləğ düzgün deyil" }, { status: 400 });
    }

    const trackId = generateTrackId();

    await db.insert(patients).values({
      trackId,
      fullName,
      age: age ? parseInt(age) : null,
      diagnosis,
      hospitalName: hospitalName || null,
      contactPhone: contactPhone || null,
      story: story || null,
      goalAmount: amount.toString(),
      status: "pending",
      documentUrl: documentUrl || null,
    });

    // Admin-ə Telegram bildirişi göndər
    const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID;
    if (adminChatId) {
      try {
        await bot.api.sendMessage(
          adminChatId,
          `🆕 <b>Yeni sayt müraciəti!</b>\n\n` +
          `👤 Xəstə: ${fullName}${age ? `, ${age} yaş` : ""}\n` +
          `🏥 Diaqnoz: ${diagnosis}\n` +
          `💰 Məbləğ: ${amount.toLocaleString("az-AZ")} ₼\n` +
          `📱 Müraciət edən: ${applicantName} (${relation})\n` +
          `📞 Telefon: ${contactPhone}\n` +
          `🔑 Kod: <code>${trackId}</code>`,
          { parse_mode: "HTML" }
        );
      } catch { /* bildiriş göndərilməsə də davam et */ }
    }

    return NextResponse.json({ trackId });
  } catch (err) {
    console.error("Apply error:", err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
