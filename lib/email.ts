import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const APP  = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

export async function sendWelcomeEmail({
  toEmail,
  toName,
}: {
  toEmail: string;
  toName: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: "OnkoDəstək platformasına xoş gəldiniz! 💙",
      html: `
<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b;">
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#0d9488);border-radius:16px;padding:16px 24px;">
      <span style="color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;">OnkoDəstək</span>
    </div>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;">Xoş gəldiniz, ${toName}! 👋</h1>
  <p style="color:#475569;line-height:1.7;">
    OnkoDəstək platformasına qeydiyyatınız uğurla tamamlandı.
    İndi Azərbaycanda onkoloji xəstələrə dəstək göstərə bilərsiniz.
  </p>
  <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:20px 24px;margin:24px 0;">
    <p style="margin:0 0 12px;font-weight:600;color:#134e4a;font-size:15px;">Platforma ilə nə edə bilərsiniz:</p>
    <p style="margin:6px 0;color:#0f766e;font-size:14px;">💰 Xəstələrə birbaşa ianə edin</p>
    <p style="margin:6px 0;color:#0f766e;font-size:14px;">📊 Hər ianənin hara getdiyini izləyin</p>
    <p style="margin:6px 0;color:#0f766e;font-size:14px;">💙 Psixoloji dəstək alın (Telegram botu)</p>
    <p style="margin:6px 0;color:#0f766e;font-size:14px;">🤝 Könüllü olaraq kömək edin</p>
  </div>
  <div style="display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap;">
    <a href="${APP}/patients"
       style="display:inline-block;background:#0d9488;color:white;text-decoration:none;
              font-weight:600;font-size:14px;padding:12px 20px;border-radius:10px;">
      Xəstələrə bax →
    </a>
    <a href="${APP}/me"
       style="display:inline-block;background:#f8fafc;border:1px solid #e2e8f0;color:#475569;text-decoration:none;
              font-weight:600;font-size:14px;padding:12px 20px;border-radius:10px;">
      Profilim
    </a>
  </div>
  <p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:8px;">
    OnkoDəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
    });
  } catch (err) {
    console.error("Xoş gəldiniz email xətası:", err);
  }
}

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
    <strong>${patientName}</strong> üçün etdiyiniz <strong>${parseFloat(amount).toLocaleString("az-AZ")} ₼</strong> məbləğindəki
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
    OnkoDəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
    });
  } catch (err) {
    console.error("Email göndərmə xətası:", err);
  }
}

export async function sendPatientUpdateNotification({
  donors,
  patientName,
  patientId,
  updateContent,
}: {
  donors: { email: string; name: string | null }[];
  patientName: string;
  patientId: number;
  updateContent: string;
}) {
  if (!process.env.RESEND_API_KEY || donors.length === 0) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const preview = updateContent.length > 120 ? updateContent.slice(0, 120) + "…" : updateContent;

  await Promise.allSettled(
    donors.map(({ email, name }) =>
      resend.emails.send({
        from: FROM,
        to: email,
        subject: `${patientName} haqqında yeni xəbər — OnkoDəstək`,
        html: `
<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b;">
  <h1 style="font-size:20px;font-weight:700;margin-bottom:8px;">Yeni xəbər: ${patientName}</h1>
  <p style="color:#475569;line-height:1.6;">Hörmətli ${name ?? "ianəçi"},</p>
  <p style="color:#475569;line-height:1.6;">
    Dəstək verdiyin <strong>${patientName}</strong> haqqında yeni məlumat paylaşıldı:
  </p>
  <div style="background:#f8fafc;border-left:3px solid #0d9488;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;color:#334155;font-size:15px;line-height:1.7;">
    ${preview}
  </div>
  <a href="${APP}/patients/${patientId}"
     style="display:inline-block;background:#0d9488;color:white;text-decoration:none;
            font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;margin-bottom:24px;">
    Tam məlumatı oxu →
  </a>
  <p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:16px;">
    Bu emaili aldınız çünki ${patientName} üçün ianə etmisiniz.<br>
    OnkoDəstək — <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
      })
    )
  );
}

export async function sendVolunteerInterviewInvite({
  toEmail, toName, area,
}: { toEmail: string; toName: string; area: string }) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: "Müsahibəyə dəvət — OnkoDəstək 🎉",
      html: `
<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b;">
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#0d9488);border-radius:16px;padding:14px 22px;">
      <span style="color:white;font-size:18px;font-weight:800;">OnkoDəstək</span>
    </div>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;">Müsahibəyə dəvət alırsınız! 🎉</h1>
  <p style="color:#475569;line-height:1.7;">Hörmətli ${toName},</p>
  <p style="color:#475569;line-height:1.7;">
    <strong>${area}</strong> sahəsindəki könüllü müraciətinizi nəzərdən keçirdik və sizi
    müsahibəyə dəvət etmək istəyirik.
  </p>
  <div style="background:#fefce8;border:1px solid #fde68a;border-radius:12px;padding:20px 24px;margin:24px 0;">
    <p style="margin:0 0 8px;font-weight:600;color:#92400e;">📅 Növbəti addım:</p>
    <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">
      Komandamız 24–48 saat ərzində sizinlə əlaqə saxlayaraq müsahibənin tarix və vaxtını razılaşdıracaq.
      Zəhmət olmasa bu emailə cavab verin və ya bizimlə əlaqə saxlayın.
    </p>
  </div>
  <a href="mailto:info@onkodestek.az"
     style="display:inline-block;background:#0d9488;color:white;text-decoration:none;
            font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;margin-bottom:24px;">
    Bizə cavab yaz →
  </a>
  <p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;">
    OnkoDəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
    });
  } catch (err) { console.error("Interview invite email xətası:", err); }
}

export async function sendVolunteerAccepted({
  toEmail, toName, area,
}: { toEmail: string; toName: string; area: string }) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: "Könüllü seçildiniz — OnkoDəstək 💙",
      html: `
<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b;">
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#0d9488);border-radius:16px;padding:14px 22px;">
      <span style="color:white;font-size:18px;font-weight:800;">OnkoDəstək</span>
    </div>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;">Xoş xəbər — siz könüllü seçildiniz! 💙</h1>
  <p style="color:#475569;line-height:1.7;">Hörmətli ${toName},</p>
  <p style="color:#475569;line-height:1.7;">
    <strong>${area}</strong> sahəsindəki müraciətinizi qiymətləndirdik və sizi
    <strong>OnkoDəstək könüllü komandası</strong>na qəbul etmək qərarına gəldik.
  </p>
  <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:20px 24px;margin:24px 0;">
    <p style="margin:0 0 8px;font-weight:600;color:#166534;">✅ Növbəti addımlar:</p>
    <p style="margin:0;color:#15803d;font-size:14px;line-height:1.7;">
      Komandamız sizinlə əlaqə saxlayaraq fəaliyyət istiqamətləri, vəzifələr
      və ilk görüş barədə məlumat verəcək. Bizimlə birlikdə daha çox insana çatacağıq!
    </p>
  </div>
  <a href="mailto:info@onkodestek.az"
     style="display:inline-block;background:#16a34a;color:white;text-decoration:none;
            font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;margin-bottom:24px;">
    Komanda ilə əlaqə →
  </a>
  <p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;">
    OnkoDəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
    });
  } catch (err) { console.error("Accepted email xətası:", err); }
}

export async function sendVolunteerRejected({
  toEmail, toName, area,
}: { toEmail: string; toName: string; area: string }) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: "Könüllü müraciətiniz haqqında — OnkoDəstək",
      html: `
<div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b;">
  <div style="text-align:center;margin-bottom:28px;">
    <div style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#0d9488);border-radius:16px;padding:14px 22px;">
      <span style="color:white;font-size:18px;font-weight:800;">OnkoDəstək</span>
    </div>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;">Müraciətiniz haqqında məlumat</h1>
  <p style="color:#475569;line-height:1.7;">Hörmətli ${toName},</p>
  <p style="color:#475569;line-height:1.7;">
    <strong>${area}</strong> sahəsindəki könüllü müraciətiniz üçün təşəkkür edirik.
    Bütün müraciətlər diqqətlə nəzərdən keçirildi. Təəssüf ki, bu dəfə
    komandamıza uyğun yer tapa bilmədik.
  </p>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin:24px 0;">
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">
      💙 Onkoloji xəstələrə dəstək olmaq istədiyiniz üçün çox minnətdarıq.
      Gələcəkdə yeni könüllülük imkanları yarandığında sizinlə yenidən əlaqə saxlaya bilərik.
      Bu arada platforma üzərindən xəstələrə birbaşa ianə edərək dəstək ola bilərsiniz.
    </p>
  </div>
  <a href="${APP}/patients"
     style="display:inline-block;background:#0d9488;color:white;text-decoration:none;
            font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;margin-bottom:24px;">
    Xəstələrə dəstək ol →
  </a>
  <p style="color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;">
    OnkoDəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
    });
  } catch (err) { console.error("Rejected email xətası:", err); }
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
      subject: "Könüllü müraciətiniz alındı — OnkoDəstək",
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
    OnkoDəstək — Azərbaycanda onkoloji xəstələrə şəffaf xeyriyyə platforması.<br>
    <a href="${APP}" style="color:#0d9488;">onkodestek.vercel.app</a>
  </p>
</div>`,
    });
  } catch (err) {
    console.error("Könüllü email xətası:", err);
  }
}
