import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients, botSessions } from "@/drizzle/schema";
import { eq, like, desc } from "drizzle-orm";
import { PatientCreateSchema } from "@/lib/schemas";

const APP = "https://onkodestek.vercel.app";

async function notifySubscribers(fullName: string, diagnosis: string, patientId: number | string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const rows = await db
    .select()
    .from(botSessions)
    .where(like(botSessions.key, "subscriber:%"));

  if (rows.length === 0) return;

  const text =
    `🔔 <b>Yeni müraciət əlavə olundu</b>\n\n` +
    `👤 <b>${fullName}</b>\n` +
    `🏥 ${diagnosis}\n\n` +
    `İanə etmək və ya izləmək üçün:`;

  await Promise.allSettled(
    rows.map((row) => {
      const chatId = parseInt(row.key.replace("subscriber:", ""), 10);
      if (isNaN(chatId)) return Promise.resolve();
      return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[
              { text: "💙 İanə et", url: `${APP}/patients/${patientId}` },
            ]],
          },
        }),
      });
    })
  );
}

// GET /api/patients?offset=0&limit=9 — ictimai xəstələri səhifələnmiş gətir
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0"));
  const limit  = Math.min(12, Math.max(1, parseInt(searchParams.get("limit") ?? "9")));

  try {
    const rows = await db
      .select()
      .from(patients)
      .where(eq(patients.isPublic, true))
      .orderBy(desc(patients.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = rows.length > limit;
    return NextResponse.json({ patients: rows.slice(0, limit), hasMore });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ patients: [], hasMore: false }, { status: 500 });
  }
}

// POST /api/patients — admin: yeni xəstə əlavə et
export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = PatientCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Məlumatlar düzgün deyil", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [patient] = await db.insert(patients).values(parsed.data).returning();

    // Abunəçilərə Telegram bildirişi (fire-and-forget)
    notifySubscribers(patient.fullName, patient.diagnosis, patient.id).catch(() => {});

    return NextResponse.json(patient, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }
}
