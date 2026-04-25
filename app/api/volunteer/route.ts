import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { volunteerRequests } from "@/drizzle/schema";
import { isAdmin } from "@/lib/adminAuth";
import { VolunteerSchema } from "@/lib/schemas";

const AREA_LABELS: Record<string, string> = {
  tibbi:     "Tibbi dəstək",
  hüquqi:    "Hüquqi yardım",
  texniki:   "Texniki dəstək",
  media:     "Media / PR",
  psixoloji: "Psixoloji dəstək",
  digər:     "Digər",
};

async function notifyAdminTelegram(data: {
  fullName: string;
  email: string;
  phone?: string | null;
  area: string;
  message?: string | null;
}) {
  const token   = process.env.TELEGRAM_BOT_TOKEN;
  const chatId  = process.env.ADMIN_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const APP = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";
  const text =
    `🤝 <b>Yeni könüllü müraciəti</b>\n\n` +
    `👤 <b>${data.fullName}</b>\n` +
    `📧 ${data.email}\n` +
    (data.phone ? `📞 ${data.phone}\n` : "") +
    `🏷 ${AREA_LABELS[data.area] ?? data.area}\n` +
    (data.message ? `\n💬 ${data.message}\n` : "") +
    `\n🔗 <a href="${APP}/dashboard/volunteers">Admin paneldə bax</a>`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch (err) {
    console.error("Telegram bildiriş xətası:", err);
  }
}

// GET /api/volunteer — admin: bütün müraciətlər
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const list = await db
    .select()
    .from(volunteerRequests)
    .orderBy(volunteerRequests.createdAt);
  return NextResponse.json(list);
}

// POST /api/volunteer — ictimai: könüllü müraciəti
export async function POST(req: NextRequest) {
  const parsed = VolunteerSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Məlumatlar düzgün deyil", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { _trap, ...data } = parsed.data;
  if (_trap) return NextResponse.json({ ok: true }); // honeypot

  const [record] = await db.insert(volunteerRequests).values(data).returning();

  // Admin-ə Telegram bildirişi (qeyri-bloklayan)
  notifyAdminTelegram(data).catch(console.error);

  return NextResponse.json(record, { status: 201 });
}
