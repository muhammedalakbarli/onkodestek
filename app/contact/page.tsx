import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Əlaqə — OnkoDəstək",
  description: "OnkoDəstək komandası ilə əlaqə saxlayın. Sual, müraciət, könüllülük və ya əməkdaşlıq üçün bizimlə əlaqə qurun.",
};

const CHANNELS = [
  {
    title: "Telegram botu",
    desc: "Psixoloji dəstək, müraciət statusu, ümumi suallar üçün botumuzla əlaqə saxlayın.",
    action: "Bota yazın",
    href: "https://t.me/OnkoDestek_bot",
    iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8c-.12.58-.45.72-.91.45l-2.52-1.86-1.21 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1l-5.74 3.62-2.47-.77c-.54-.17-.55-.54.11-.8l9.64-3.72c.45-.16.84.11.69.53z",
    iconFill: true,
    color: "bg-blue-50 border-blue-100",
    iconColor: "bg-blue-100 text-blue-600",
    external: true,
  },
  {
    title: "Admin Telegram",
    desc: "Könüllülük, əməkdaşlıq, media sorğuları və digər rəsmi məsələlər üçün adminlə əlaqə.",
    action: "Adminə yazın",
    href: "https://t.me/onkodestek_admin",
    iconPath: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
    iconFill: true,
    color: "bg-teal-50 border-teal-100",
    iconColor: "bg-teal-100 text-teal-600",
    external: true,
  },
  {
    title: "Müraciət formu",
    desc: "Yardıma ehtiyacınız varsa, sayt daxilindəki müraciət formasını doldurun.",
    action: "Müraciət et",
    href: "/apply",
    iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    iconFill: false,
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "bg-emerald-100 text-emerald-600",
    external: false,
  },
];

const FAQ = [
  {
    q: "Müraciətim nə qədər müddətdə baxılır?",
    a: "Müraciətlər adətən 1–3 iş günü ərzində yoxlanılır. Sənədlər tam və düzgün olduqda prosess daha sürətli gedir.",
  },
  {
    q: "Könüllü olmaq üçün nə etməliyəm?",
    a: "onkodestek.az/volunteer səhifəsindəki formu doldurun. Hansı sahədə kömək edə biləcəyinizi seçin — komandamız sizinlə əlaqə saxlayacaq.",
  },
  {
    q: "İanə etmək üçün qeydiyyat lazımdırmı?",
    a: "Hazırda ianə bank köçürməsi vasitəsilə həyata keçirilir. Xəstənin səhifəsindəki əlaqə məlumatlarından istifadə edin.",
  },
  {
    q: "Müraciət rədd edilərsə nə baş verir?",
    a: "Sənədlər tam deyilsə əlavə məlumat istənilir. Tamamilə rədd halında səbəb izah edilir, yenidən müraciət etmək mümkündür.",
  },
  {
    q: "Platformanın xərcləri kimə düşür?",
    a: "Platforma inzibati xərclər üçün heç bir ianə tutmur. Bütün vəsait 100% xəstəyə yönləndirilir. Texniki xərclər könüllü dəstəklə ödənilir.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-900 via-teal-800 to-blue-900 py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <svg className="w-4 h-4 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span className="text-teal-200 text-sm font-medium">Əlaqə</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Bizimlə əlaqə saxlayın
            </h1>
            <p className="text-teal-100/80 text-sm max-w-md mx-auto">
              Sual, müraciət, könüllülük və ya əməkdaşlıq üçün aşağıdakı kanallardan birini seçin.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* Əlaqə kanalları */}
          <div className="grid sm:grid-cols-3 gap-4">
            {CHANNELS.map((c) => (
              <div key={c.title} className={`bg-white border ${c.color.split(" ")[1]} rounded-2xl p-6 shadow-sm flex flex-col`}>
                <div className={`w-11 h-11 ${c.iconColor} rounded-xl flex items-center justify-center mb-4 shrink-0`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={c.iconFill ? "currentColor" : "none"} stroke={c.iconFill ? "none" : "currentColor"} strokeWidth="1.8">
                    <path strokeLinecap={c.iconFill ? undefined : "round"} strokeLinejoin={c.iconFill ? undefined : "round"} d={c.iconPath} />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5">{c.desc}</p>
                {c.external ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    {c.action}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <a
                    href={c.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    {c.action}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* SSS */}
          <div>
            <div className="mb-7">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-1">SSS</p>
              <h2 className="text-2xl font-bold text-slate-900">Tez-tez soruşulan suallar</h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <div key={item.q} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">{item.q}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Könüllülük CTA */}
          <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Könüllü olmaq istəyirsiniz?</h2>
            <p className="text-blue-100 text-sm mb-5 max-w-md mx-auto">
              Tibbi, hüquqi, texniki, media sahəsində kömək edə bilərsiniz.
              Formu doldurun, sizinlə əlaqə saxlayaq.
            </p>
            <a
              href="/volunteer"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-6 py-3 rounded-full hover:bg-teal-50 transition-colors text-sm shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Könüllü formu doldur
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
