import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PatientCard from "@/components/PatientCard";
import StatCard from "@/components/StatCard";
import RecentDonorsFeed from "@/components/RecentDonorsFeed";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq, sql, sum } from "drizzle-orm";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getPublicPatients() {
  try {
    return await db
      .select()
      .from(patients)
      .where(eq(patients.isPublic, true))
      .limit(6);
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [ps] = await db
      .select({
        active:    sql<number>`count(*) filter (where status = 'active')`,
        funded:    sql<number>`count(*) filter (where status = 'funded')`,
        totalCollected: sum(patients.collectedAmount),
      })
      .from(patients);

    const [ts] = await db
      .select({
        donationCount: sql<number>`count(*) filter (where type = 'donation')`,
      })
      .from(transactions);

    return {
      activeCount:    Number(ps.active ?? 0),
      fundedCount:    Number(ps.funded ?? 0),
      totalCollected: parseFloat(String(ps.totalCollected ?? "0")),
      donationCount:  Number(ts.donationCount ?? 0),
    };
  } catch {
    return { activeCount: 0, fundedCount: 0, totalCollected: 0, donationCount: 0 };
  }
}

export default async function HomePage() {
  const [publicPatients, stats] = await Promise.all([
    getPublicPatients(),
    getStats(),
  ]);

  const { activeCount, fundedCount, totalCollected, donationCount } = stats;

  return (
    <>
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-teal-800 to-blue-900 text-white">
        {/* Fon naxışı */}
        <div className="absolute inset-0 hero-pattern opacity-40 pointer-events-none" />

        {/* Dekorativ dairələr */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Etiket */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Real vaxtlı maliyyə şəffaflığı
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight animate-fade-in-up-delay-1">
              Həyata{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-200">
                dəstək ol
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up-delay-2">
              Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə birbaşa,
              sənədli və şəffaf şəkildə yardım göstər.
              <span className="text-white font-medium"> Hər qəpiyin hara getdiyini özün izlə.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up-delay-3">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-8 py-3.5 rounded-full hover:bg-teal-50 active:scale-95 transition-all shadow-lg shadow-black/20 text-sm"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Yardım müraciəti
              </Link>
              <Link
                href="/patients"
                className="inline-flex items-center justify-center gap-2 glass text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/15 active:scale-95 transition-all text-sm"
              >
                Xəstələrə bax
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero statistika zolağı */}
          <div className="mt-16 grid grid-cols-3 gap-3 max-w-lg mx-auto animate-fade-in-up-delay-3">
            {[
              { value: `${activeCount}`, label: "Aktiv kampaniya" },
              { value: formatCurrency(totalCollected), label: "Toplanmış vəsait" },
              { value: `${fundedCount}`, label: "Uğurla tamamlandı" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center">
                <p className="text-xl font-extrabold text-white">{s.value}</p>
                <p className="text-[11px] text-blue-200 mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dalğa */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 56L60 46.7C120 37 240 19 360 14C480 9 600 18.7 720 25.7C840 32.3 960 37 1080 34.7C1200 32.3 1320 23 1380 18.7L1440 14V56H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* ── Statistika kartları ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Cəmi toplanıb"
            value={formatCurrency(totalCollected)}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            accent="green"
          />
          <StatCard
            title="Aktiv xəstə"
            value={activeCount}
            subtitle="yığım davam edir"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            accent="blue"
          />
          <StatCard
            title="Tam dəstəkləndi"
            value={fundedCount}
            subtitle="uğurla tamamlandı"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            accent="purple"
          />
          <StatCard
            title="Ümumi ianə"
            value={donationCount}
            subtitle="ayrı-ayrı ianə"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            accent="orange"
          />
        </div>
      </section>

      {/* ── Aktiv xəstələr ──────────────────────────────────────────────────── */}
      {publicPatients.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-1">Müraciətlər</p>
              <h2 className="text-2xl font-bold text-slate-900">Aktiv yardım kampaniyaları</h2>
            </div>
            <Link
              href="/patients"
              className="text-sm font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 transition-colors"
            >
              Hamısı
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicPatients.map((p) => (
              <PatientCard key={p.id} patient={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Necə işləyir ────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-2">Proses</p>
            <h2 className="text-3xl font-bold text-slate-900">Necə işləyir?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Bağlayıcı xətt (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-violet-200 -translate-y-1/2" />

            {[
              {
                num: "01",
                title: "Müraciət",
                desc: "Xəstə və ya ailə üzvü sayt forması vasitəsilə müraciət edir. Tibbi sənədlər yüklənir.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                color: "bg-blue-600",
              },
              {
                num: "02",
                title: "Yığım",
                desc: "Sənədləri yoxlanılmış xəstənin səhifəsi açılır. İanəçilər birbaşa dəstəklərini göstərir.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                color: "bg-violet-600",
              },
              {
                num: "03",
                title: "Hesabat",
                desc: "Hər xərc müvafiq qəbzlə saytda dərc edilir. İanəçi vəsaitinin hara yönəldildiyini görür.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                color: "bg-emerald-600",
              },
            ].map((item) => (
              <div key={item.num} className="relative bg-slate-50 rounded-2xl p-7 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white mb-5 shadow-sm`}>
                  {item.icon}
                </div>
                <span className="text-5xl font-black text-slate-100 absolute top-5 right-6 select-none">{item.num}</span>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dəstəkləmə istiqamətləri ───────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-2">Fəaliyyət sahələri</p>
            <h2 className="text-3xl font-bold text-slate-900">Nəyi ödəyirik?</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">
              Toplanmış vəsait yalnız xəstənin birbaşa tibbi ehtiyacları üçün istifadə edilir.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
                title: "Dərman xərcləri",
                desc: "Kimyaterapiya, hormon terapiyası, ağrıkəsici və digər müalicə dərmanları.",
                color: "bg-teal-100 text-teal-700",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
                title: "Xəstəxana xərcləri",
                desc: "Cərrahiyyə əməliyyatı, hospitalizasiya, laboratoriya analizləri və müayinələr.",
                color: "bg-blue-100 text-blue-700",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
                title: "Konsultasiya",
                desc: "Onkoloq, cərrah və digər ixtisaslı həkim müayinələri üçün ödənişlər.",
                color: "bg-violet-100 text-violet-700",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
                title: "Nəqliyyat",
                desc: "Müalicə mərkəzinə mütəmadi gedib-gəlmə xərcləri, xüsusilə şəhərdənkənar xəstələr üçün.",
                color: "bg-amber-100 text-amber-700",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
                title: "Psixoloji dəstək",
                desc: "Xəstə və ailə üçün psixoloq seansları. Telegram botu vasitəsilə pulsuz ilkin dəstək.",
                color: "bg-rose-100 text-rose-700",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />,
                title: "Tibbi avadanlıq",
                desc: "Ev şəraitində müalicə üçün lazım olan tibbi cihaz və ləvazimatlar.",
                color: "bg-emerald-100 text-emerald-700",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-teal-100 transition-all">
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Könüllü ol ──────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-3">Könüllülük</p>
                <h2 className="text-3xl font-extrabold mb-4 leading-tight">
                  Pul olmadan da<br />dəstək ola bilərsiniz
                </h2>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Sosial media paylaşımı, sənəd yoxlamasında kömək, hüquqi məsləhət,
                  tibbi ekspertiza — hər formada könüllü dəstəyə ehtiyacımız var.
                </p>
                <a
                  href="https://t.me/onkodestek_admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-6 py-3 rounded-full hover:bg-teal-50 transition-colors text-sm shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Bizimlə əlaqə saxla
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Paylaşım", desc: "Kampaniyaları sosial mediada yay" },
                  { label: "Ekspertiza", desc: "Tibbi/hüquqi məsləhət ver" },
                  { label: "Tərcümə", desc: "Sənədlərin tərcüməsində kömək et" },
                  { label: "Texniki", desc: "Platformanın inkişafına töhfə ver" },
                ].map((v) => (
                  <div key={v.label} className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="font-bold text-white text-sm mb-1">{v.label}</p>
                    <p className="text-blue-200 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── İnanc bölməsi ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Sənəd Yoxlaması",
                desc: "Hər xəstənin tibbi sənədləri komanda tərəfindən şəxsən yoxlanılır. Yoxlanılmamış müraciətlər ictimaiyyətə açılmır.",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: "Birbaşa Köçürmə",
                desc: "Toplanmış vəsait xəstənin müalicəsi üçün birbaşa xəstəxanaya və ya əczaçılığa köçürülür.",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                ),
                title: "Qəbz Şəffaflığı",
                desc: "Xərclənən hər qəpik rəsmi qəbzlə platformada dərc edilir. Tarixcə heç vaxt silinmir.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 bg-teal-900/40 border border-teal-700/30 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Image src="/logo.jpeg" alt="OnkoDəstək" width={28} height={28} className="rounded-lg object-contain" />
                <span className="font-bold text-white text-base">OnkoDəstək</span>
              </div>
              <p className="text-sm max-w-xs leading-relaxed">
                Azərbaycanda xərçənglə mübarizəni rəqəmsallaşdıraraq hər xəstəyə sistemli dəstək göstəririk.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <p className="text-slate-300 font-semibold mb-3">Platforma</p>
                <div className="flex flex-col gap-2">
                  <Link href="/patients" className="hover:text-white transition-colors">Xəstələr</Link>
                  <Link href="/transparency" className="hover:text-white transition-colors">Şəffaflıq</Link>
                  <Link href="/apply" className="hover:text-white transition-colors">Müraciət et</Link>
                  <Link href="/about" className="hover:text-white transition-colors">Haqqımızda</Link>
                </div>
              </div>
              <div>
                <p className="text-slate-300 font-semibold mb-3">Əlaqə</p>
                <div className="flex flex-col gap-2">
                  <a href="https://t.me/OnkoDestek_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram botu</a>
                  <a href="https://t.me/onkodestek_admin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Admin</a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-xs text-slate-600 text-center space-y-2">
            <div>© 2026 OnkoDəstək — Həyata dəstək ol</div>
            <div className="flex justify-center gap-4">
              <Link href="/privacy" className="hover:text-slate-400 transition-colors">Məxfilik siyasəti</Link>
              <Link href="/terms" className="hover:text-slate-400 transition-colors">İstifadə şərtləri</Link>
              <Link href="/about" className="hover:text-slate-400 transition-colors">Haqqımızda</Link>
            </div>
          </div>
        </div>
      </footer>
      <RecentDonorsFeed />
    </>
  );
}
