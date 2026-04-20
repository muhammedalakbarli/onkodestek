import Link from "next/link";
import Navbar from "@/components/Navbar";
import PatientCard from "@/components/PatientCard";
import StatCard from "@/components/StatCard";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq, sql, sum, count } from "drizzle-orm";
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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                dəstək ol
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up-delay-2">
              Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə birbaşa,
              sənədli və şəffaf şəkildə yardım göstər.
              <span className="text-white font-medium"> Hər qəpiyin hara getdiyini özün izlə.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up-delay-3">
              <a
                href="https://t.me/OnkoDestek_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 active:scale-95 transition-all shadow-lg shadow-black/20 text-sm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8c-.12.58-.45.72-.91.45l-2.52-1.86-1.21 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1l-5.74 3.62-2.47-.77c-.54-.17-.55-.54.11-.8l9.64-3.72c.45-.16.84.11.69.53z"/>
                </svg>
                Telegram ilə müraciət et
              </a>
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
            icon="💰"
            accent="green"
          />
          <StatCard
            title="Aktiv xəstə"
            value={activeCount}
            subtitle="yığım davam edir"
            icon="🏥"
            accent="blue"
          />
          <StatCard
            title="Tam dəstəkləndi"
            value={fundedCount}
            subtitle="uğurla tamamlandı"
            icon="✅"
            accent="purple"
          />
          <StatCard
            title="Ümumi ianə"
            value={donationCount}
            subtitle="ayrı-ayrı ianə"
            icon="🤝"
            accent="orange"
          />
        </div>
      </section>

      {/* ── Aktiv xəstələr ──────────────────────────────────────────────────── */}
      {publicPatients.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Müraciətlər</p>
              <h2 className="text-2xl font-bold text-slate-900">Aktiv yardım kampaniyaları</h2>
            </div>
            <Link
              href="/patients"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
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
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Proses</p>
            <h2 className="text-3xl font-bold text-slate-900">Necə işləyir?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Bağlayıcı xətt (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-violet-200 -translate-y-1/2" />

            {[
              {
                num: "01",
                title: "Müraciət",
                desc: "Xəstə və ya ailə üzvü Telegram botu vasitəsilə müraciət edir. Tibbi sənədlər yoxlanılır.",
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

      {/* ── İnanc bölməsi ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "Sənəd Yoxlaması",
                desc: "Hər xəstənin tibbi sənədləri komanda tərəfindən şəxsən yoxlanılır. Yoxlanılmamış müraciətlər ictimaiyyətə açılmır.",
              },
              {
                icon: "💳",
                title: "Birbaşa Köçürmə",
                desc: "Toplanmış vəsait xəstənin müalicəsi üçün birbaşa xəstəxanaya və ya əczaçılığa köçürülür.",
              },
              {
                icon: "📄",
                title: "Qəbz Şəffaflığı",
                desc: "Xərclənən hər qəpik rəsmi qəbzlə platformada dərc edilir. Tarixcə heç vaxt silinmir.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 bg-blue-900/60 border border-blue-700/40 rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5">
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
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <span className="font-bold text-white text-base">onkodəstək</span>
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
            <div>© 2026 onkodəstək — Həyata dəstək ol</div>
            <div className="flex justify-center gap-4">
              <Link href="/privacy" className="hover:text-slate-400 transition-colors">Məxfilik siyasəti</Link>
              <Link href="/terms" className="hover:text-slate-400 transition-colors">İstifadə şərtləri</Link>
              <Link href="/about" className="hover:text-slate-400 transition-colors">Haqqımızda</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
