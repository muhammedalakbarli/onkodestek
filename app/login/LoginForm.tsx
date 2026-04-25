"use client";

import { useState, useRef, useCallback } from "react";
import { signIn } from "next-auth/react";

// ── Modal məzmunu ─────────────────────────────────────────────────────────────

const PRIVACY_CONTENT = `1. Hansı məlumatları toplayırıq?

OnkoDəstək platformasından istifadə etdikdə aşağıdakı məlumatlar toplanır:

• Müraciət forması: Ad, soyad, telefon nömrəsi, xəstənin tibbi məlumatları
• Google ilə giriş: Ad, e-poçt ünvanı, profil şəkli (Google tərəfindən verilir)
• Telegram botu: Telegram istifadəçi ID-si, müraciət məlumatları
• Texniki məlumatlar: IP ünvanı (spam mühafizəsi üçün), brauzer növü

Həssas məlumat: Xəstələrin tibbi sənədləri həssas şəxsi məlumat kateqoriyasına daxildir. Bu məlumatlar yalnız verifikasiya məqsədilə istifadə olunur və icazəsiz girişin qarşısını almaq üçün şifrələnmiş şəkildə saxlanılır.

2. Məlumatları nə üçün istifadə edirik?

• Müraciətləri yoxlamaq və platformada idarə etmək
• İzləmə kodu vasitəsilə müraciət statusunu göstərmək — izləmə kodu müraciətçinin şəxsi identifikasiyasını gizli saxlayaraq, ictimaiyyətə ianə gedişatını izləmək imkanı verir
• Donor hesabını idarə etmək və ianə tarixçəsini saxlamaq
• Spam və saxta müraciətlərin qarşısını almaq

3. Məlumatları kimlərlə paylaşırıq?

Şəxsi məlumatlarınız heç vaxt üçüncü tərəflərə satılmır. Yalnız aşağıdakı hallarda paylaşılır:

• Texniki xidmətlər: Vercel (hosting), Neon (verilənlər bazası), Google (autentifikasiya)
• Qanuni tələblər: Məhkəmə qərarı və ya hüquq-mühafizə orqanlarının tələbi ilə

4. Məlumatlar nə qədər saxlanılır?

• Müraciət məlumatları: platforma fəaliyyət göstərdiyi müddət
• İstifadəçi hesabı: hesab silindikdə şəxsi məlumatlar silinir, lakin maliyyə şəffaflığı və hesabatlılıq məqsədilə ianə məbləğləri anonim olaraq saxlanıla bilər
• IP ünvanları (rate limiting): 1 saat

5. Hüquqlarınız

Siz istənilən vaxt saxlanılan məlumatlarınız haqqında məlumat ala, məlumatlarınızın silinməsini tələb edə və hesabınızı silə bilərsiniz. Müraciət üçün: @onkodestek_admin

6. Cookies

Platform yalnız autentifikasiya üçün zəruri cookies istifadə edir. Reklam və izləmə cookie-ləri istifadə edilmir.

7. Beynəlxalq məlumat ötürülməsi

Platformanın texniki infrastrukturu ABŞ-da yerləşir. Məlumatlarınız aşağıdakı xidmət provayderlərinə ötürülə bilər:

• Vercel Inc. (ABŞ) — hosting və serverless funksiyalar
• Neon Inc. (ABŞ) — PostgreSQL verilənlər bazası
• Google LLC (ABŞ) — autentifikasiya (OAuth)
• Resend Inc. (ABŞ) — e-poçt bildirişləri

Azərbaycan Respublikasının "Fərdi məlumatlar haqqında" qanununun 10-cu maddəsinə əsasən beynəlxalq ötürmə üçün müraciət formasında açıq razılığınız alınır.

8. Hüquqi əsas

Bu siyasət Azərbaycan Respublikasının "Fərdi məlumatlar haqqında" qanununa və beynəlxalq data qorunması prinsiplərinə (GDPR) uyğun olaraq hazırlanmışdır.`;

const TERMS_CONTENT = `1. Ümumi Müddəalar

OnkoDəstək ("Platforma") Azərbaycanda onkoloji xəstəliklə mübarizə aparan xəstələrə şəffaf maliyyə dəstəyi göstərmək məqsədilə yaradılmış qeyri-kommersiya xeyriyyəçilik platformasıdır.

Platformadan istifadə etməklə siz bu İstifadə Şərtlərini oxuduğunuzu, başa düşdüyünüzü və qəbul etdiyinizi təsdiqləyirsiniz.

2. İstifadəçi Tələbləri

• 18 yaşını tamamlamış olmalısınız (və ya qanuni nümayəndənin razılığı ilə)
• Azərbaycan Respublikasının qüvvədə olan qanunvericiliyinə uyğun hərəkət etməlisiniz
• Düzgün və tam məlumat təqdim etməlisiniz
• Platformanı yalnız qanuni məqsədlər üçün istifadə etməlisiniz

3. Yardım Müraciətləri

• Təqdim etdiyiniz bütün məlumatlar doğru və həqiqi olmalıdır
• Yanlış məlumat vermək müraciətin rədd edilməsinə və hüquqi məsuliyyətə səbəb ola bilər
• Tibbi sənədlər platforma komandası tərəfindən yoxlanılacaq
• Müraciətin qəbul edilib-edilməməsi barədə qərar müstəqil olaraq platforma tərəfindən verilir
• Müraciətiniz rədd edilərsə, yenidən müraciət etmək hüququnuz qorunur

4. Vəsaitin İstifadəsi

• Toplanmış bütün vəsaitlər yalnız xəstənin tibbi ehtiyacları üçün istifadə edilir
• Hər xərc rəsmi qəbz və hesabat sənədi ilə əsaslandırılır
• Maliyyə hesabatları platforma üzərindən ictimaiyyətə açıqdır
• Heç bir ianə inzibati xərclər üçün yönləndirilmir
• Hədəfdən artıq toplanan vəsait digər aktiv xəstəyə yönləndirilir və ya donora qaytarılır

5. Qadağan Edilmiş Hərəkətlər

• Yanlış, aldadıcı və ya saxta məlumat vermək
• Başqasının adından müraciət göndərmək (xəstənin yazılı razılığı olmadan)
• Platformanın texniki infrastrukturuna zərər vermək cəhdi
• Digər istifadəçilərin şəxsi məlumatlarına icazəsiz daxil olmaq
• Platformanı spam, reklam və ya kommersiya məqsədləri üçün istifadə etmək

6. Məsuliyyətin Məhdudlaşdırılması

OnkoDəstək:
• Xəstəlik diaqnozunun düzgünlüyünə zəmanət vermir
• Toplanan vəsaitin xəstənin tam sağalmasını təmin edəcəyinə zəmanət vermir
• Xidmət fasilələrindən, texniki xətalardan irəli gələn zərərlərə görə məsuliyyət daşımır

7. Şəxsi Məlumatlar

Şəxsi məlumatlarınız Məxfilik Siyasətimizə uyğun olaraq emal edilir. Platformada topladığımız məlumatlar üçüncü şəxslərə satılmır, yalnız xidmətin göstərilməsi üçün istifadə edilir.

8. Şərtlərin Dəyişdirilməsi

Bu şərtlər zəruri hallarda yenilənə bilər. Əhəmiyyətli dəyişikliklər haqqında istifadəçilər platforma daxilindəki bildiriş vasitəsilə məlumatlandırılacaq.

9. Əlaqə

Bu şərtlərlə bağlı suallarınız varsa Telegram üzərindən bizimlə əlaqə saxlaya bilərsiniz: @onkodestek_admin`;

// ── Scroll-to-bottom modal ────────────────────────────────────────────────────

function DocModal({
  title,
  content,
  onAccept,
  onClose,
}: {
  title: string;
  content: string;
  onAccept: () => void;
  onClose: () => void;
}) {
  const [reachedBottom, setReachedBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 32;
    if (atBottom) setReachedBottom(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90dvh]">

        {/* Başlıq */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h2 className="font-bold text-slate-900 text-base">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Məzmun */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-5 py-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line"
        >
          {content}
          {/* Sona çatma indikatoru */}
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-100" />
            <span>Sənədin sonu</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        </div>

        {/* Alt panel */}
        <div className="px-5 py-4 border-t border-slate-100 shrink-0">
          {!reachedBottom && (
            <p className="text-xs text-amber-600 text-center mb-3 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Qəbul etmək üçün sona qədər oxuyun
            </p>
          )}
          <button
            type="button"
            onClick={() => { onAccept(); onClose(); }}
            disabled={!reachedBottom}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {reachedBottom ? "Oxudum, qəbul edirəm ✓" : "Oxuyun..."}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Əsas forma ────────────────────────────────────────────────────────────────

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [privacyRead, setPrivacyRead] = useState(false);
  const [termsRead,   setTermsRead]   = useState(false);
  const [modal, setModal] = useState<"privacy" | "terms" | null>(null);
  const [loading, setLoading] = useState(false);

  const agreed = privacyRead && termsRead;

  async function handleGoogle() {
    if (!agreed || loading) return;
    setLoading(true);
    const loginCallback = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    await signIn("google", { callbackUrl: loginCallback });
  }

  return (
    <>
      {modal === "privacy" && (
        <DocModal
          title="Məxfilik Siyasəti"
          content={PRIVACY_CONTENT}
          onAccept={() => setPrivacyRead(true)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "terms" && (
        <DocModal
          title="İstifadə Şərtləri"
          content={TERMS_CONTENT}
          onAccept={() => setTermsRead(true)}
          onClose={() => setModal(null)}
        />
      )}

      <div className="space-y-3">
        {/* Məxfilik siyasəti */}
        <button
          type="button"
          onClick={() => setModal("privacy")}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
            privacyRead
              ? "border-teal-500 bg-teal-50 text-teal-800"
              : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
              privacyRead ? "bg-teal-600 border-teal-600" : "border-slate-300"
            }`}>
              {privacyRead && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span>Məxfilik Siyasəti</span>
          </div>
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* İstifadə şərtləri */}
        <button
          type="button"
          onClick={() => setModal("terms")}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
            termsRead
              ? "border-teal-500 bg-teal-50 text-teal-800"
              : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
              termsRead ? "bg-teal-600 border-teal-600" : "border-slate-300"
            }`}>
              {termsRead && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span>İstifadə Şərtləri</span>
          </div>
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Google düyməsi */}
        <button
          onClick={handleGoogle}
          disabled={!agreed || loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-slate-800 font-semibold py-3.5 px-5 rounded-xl transition-all text-sm shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white disabled:shadow-none mt-1"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Google ilə daxil ol
        </button>
      </div>
    </>
  );
}
