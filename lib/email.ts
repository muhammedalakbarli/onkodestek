import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const APP  = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

export async function sendDonationThankYou({
  toEmail,
  toName,
  patientName,
  amount,
  patientId,
}: {
  toEmail: string;
  toName: string;
  patientName: string;
  amount: string;
  patientId: number;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: `İanəniz üçün təşəkkür — ${patientName}`,
      html: `
<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b;">
  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;">Dəstəyiniz üçün təşəkkür edirik! 💙</h1>
  <p style="color:#475569;line-height:1.6;">Hörmətli ${toName},</p>
  <p style="color:#475569;line-height:1.6;">
    <strong>${patientName}</strong> üçün etdiyiniz <strong>${amount} ₼</strong> məbləğindəki
    ianəniz qeydə alındı. Bu dəstək birbaşa müalicə xərclərinin qarşılanmasına yönəldilir.
  </p>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
    <p style="margin:0;color:#166534;font-size:14px;">
      ✅ Şəffaflığa öhdəliyimiz çərçivəsində hər xərc qəbzlə ictimaiyyətə açıqlanır.
      Xəstənin səhifəsindən toplanmış vəsaitin necə istifadə edildiyini izləyə bilərsiniz.
    </p>
  </div>
  <a href="${APP}/patients/${patientId}"
     style="display:inline-block;background:#0d9488;color:white;text-decoration:none;
            font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;margin-bottom:24px;">
    Xəstənin səhifəsinə bax →
  </a>
  <p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:16px;">
    Onkodəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
    });
  } catch (err) {
    console.error("Email göndərmə xətası:", err);
  }
}

export async function sendVolunteerConfirmation({
  toEmail,
  toName,
  area,
}: {
  toEmail: string;
  toName: string;
  area: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: "Könüllü müraciətiniz alındı — Onkodəstək",
      html: `
<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b;">
  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;">Müraciətiniz üçün təşəkkür! 🤝</h1>
  <p style="color:#475569;line-height:1.6;">Hörmətli ${toName},</p>
  <p style="color:#475569;line-height:1.6;">
    <strong>${area}</strong> sahəsindəki könüllü müraciətiniz uğurla qeydə alındı.
    Komandamız müraciətinizi nəzərdən keçirəcək və ən qısa zamanda sizinlə əlaqə saxlayacaq.
  </p>
  <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:20px;margin:24px 0;">
    <p style="margin:0;color:#134e4a;font-size:14px;">
      💙 Onkoloji xəstələrə dəstək olmaq istədiyiniz üçün minnətdarıq.
      Hər bir könüllünün töhfəsi böyük fərq yaradır.
    </p>
  </div>
  <a href="${APP}/volunteer"
     style="display:inline-block;background:#0d9488;color:white;text-decoration:none;
            font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;margin-bottom:24px;">
    Platforma haqqında daha çox →
  </a>
  <p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:16px;">
    Onkodəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
    });
  } catch (err) {
    console.error("Könüllü email xətası:", err);
  }
}
