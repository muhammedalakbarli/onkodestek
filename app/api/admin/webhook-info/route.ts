import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN yoxdur" }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const info = await res.json();
  return NextResponse.json({ ok: true, info });
}
