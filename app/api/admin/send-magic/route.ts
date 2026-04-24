import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { signAdminToken, COOKIE_NAME, TOKEN_TTL } from "@/lib/auth";
import { bot } from "@/lib/telegram";

const SECRET  = new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback");
const LINK_TTL = 60 * 10; // 10 dəqiqə

export async function POST(req: NextRequest) {
  // Sadə throttle: sadəcə ADMIN_SECRET doğru göndərilməlidir
  // (public endpoint olduğu üçün rate-limiting middleware tərəfindən edilir)
  const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID;
  if (!adminChatId) {
    return NextResponse.json({ error: "ADMIN_TELEGRAM_CHAT_ID konfiqurasiya edilməyib" }, { status: 500 });
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app").trim();

  // Qısa ömürlü magic token yarat
  const magicToken = await new SignJWT({ role: "admin", type: "magic" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${LINK_TTL}s`)
    .sign(SECRET);

  const magicLink = `${appUrl}/api/admin/magic?token=${encodeURIComponent(magicToken)}`;

  try {
    await bot.api.sendMessage(
      adminChatId,
      `🔐 <b>Admin girişi</b>\n\n` +
      `Aşağıdakı linkə klikləyin — 10 dəqiqə etibarlıdır:\n\n` +
      `<a href="${magicLink}">✅ Dashboard-a daxil ol</a>\n\n` +
      `<i>Bu linki heç kimlə paylaşmayın.</i>`,
      { parse_mode: "HTML", link_preview_options: { is_disabled: true } }
    );
  } catch {
    return NextResponse.json({ error: "Telegram mesajı göndərilmədi" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
