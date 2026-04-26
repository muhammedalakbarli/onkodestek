import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { isAdmin } from "@/lib/adminAuth";
import { Resend } from "resend";

const Schema = z.object({
  subject:   z.string().min(1).max(200),
  body:      z.string().min(1).max(10000),
  audience:  z.enum(["all", "donors"]),
});

const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const APP  = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const adminOk = await isAdmin(req);
    if (!adminOk) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY konfiqurasiya edilməyib" }, { status: 503 });
    }

    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Sorğu oxunmadı" }, { status: 400 });
    }

    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Məlumatlar düzgün deyil" }, { status: 400 });
    }

    const { subject, body: content, audience } = parsed.data;

    const allUsers = await db
      .select({ email: users.email, name: users.name, role: users.role })
      .from(users);

    const targets = audience === "donors"
      ? allUsers.filter((u) => u.role === "donor" && u.email)
      : allUsers.filter((u) => u.email);

    if (targets.length === 0) {
      return NextResponse.json({ error: "Alıcı tapılmadı" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b;">
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#0d9488);border-radius:16px;padding:14px 22px;">
      <span style="color:white;font-size:18px;font-weight:800;">OnkoDəstək</span>
    </div>
  </div>
  <div style="white-space:pre-wrap;line-height:1.7;color:#334155;font-size:15px;">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
  <p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px;">
    OnkoDəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`;

    const BATCH = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < targets.length; i += BATCH) {
      const slice = targets.slice(i, i + BATCH);
      const results = await Promise.allSettled(
        slice.map((u) =>
          resend.emails.send({
            from: FROM,
            to: u.email!,
            subject,
            html,
          })
        )
      );
      for (const r of results) {
        if (r.status === "fulfilled") sent++;
        else failed++;
      }
    }

    return NextResponse.json({ sent, failed, total: targets.length });
  } catch (err) {
    console.error("[email/route] unhandled error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
