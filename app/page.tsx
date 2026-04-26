import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PatientFeed from "@/components/PatientFeed";
import RecentDonorsFeed from "@/components/RecentDonorsFeed";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq, sql, sum, desc } from "drizzle-orm";
import { formatCurrency } from "@/lib/utils";
import { auth } from "@/auth";
import type { Patient } from "@/drizzle/schema";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const LIMIT = 9;

async function getInitialPatients(): Promise<{ list: Patient[]; hasMore: boolean }> {
  try {
    const rows = await db
      .select()
      .from(patients)
      .where(eq(patients.isPublic, true))
      .orderBy(desc(patients.createdAt))
      .limit(LIMIT + 1);

    return { list: rows.slice(0, LIMIT), hasMore: rows.length > LIMIT };
  } catch {
    return { list: [], hasMore: false };
  }
}

async function getStats() {
  try {
    const [ps] = await db.select({
      active:         sql<number>`count(*) filter (where status = 'active')`,
      funded:         sql<number>`count(*) filter (where status = 'funded')`,
      totalCollected: sum(patients.collectedAmount),
    }).from(patients);

    const [ts] = await db.select({
      donationCount: sql<number>`count(*) filter (where type = 'donation')`,
    }).from(transactions);

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
  const [{ list, hasMore }, stats, session] = await Promise.all([
    getInitialPatients(),
    getStats(),
    auth(),
  ]);

  const isGuest = !session?.user;
  const { activeCount, fundedCount, totalCollected, donationCount } = stats;

  return (
    <>
      <Navbar />

      {/* ── Kompakt header ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-800 via-teal-800 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            {/* Sol: başlıq */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Həyata{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-200">
                  dəstək ol
                </span>
              </h1>
              <p className="text-blue-200 text-sm mt-1.5 max-w-sm">
                Azərbaycanda onkoloji xəstələrə şəffaf yardım — hər qəpik izlənir.
              </p>
            </div>

            {/* Sağ: stat zolağı */}
            <div className="flex gap-4 sm:gap-6 shrink-0">
              {[
                { value: activeCount,                 label: "Aktiv" },
                { value: formatCurrency(totalCollected), label: "Toplanıb" },
                { value: fundedCount,                 label: "Tamamlandı" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-lg sm:text-xl font-extrabold text-white leading-none">{s.value}</p>
                  <p className="text-[11px] text-blue-300 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA düymələri */}
          <div className="flex gap-3 mt-5">
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 bg-white text-teal-700 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-teal-50 transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Yardım müraciəti
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-white/20 transition-colors"
            >
              Platforma ianəsi
            </Link>
          </div>
        </div>
      </div>

      {/* ── Feed ───────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Bölmə başlığı */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-0.5">Kampaniyalar</p>
            <h2 className="text-xl font-bold text-slate-900">Aktiv yardım kampaniyaları</h2>
          </div>
          {activeCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {activeCount} aktiv
            </span>
          )}
        </div>

        {list.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-9 h-9 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Hələlik açıq müraciət yoxdur</h2>
            <p className="text-slate-400 text-sm mb-6">Yeni kampaniyalar əlavə olunduqda burada görünəcək.</p>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm"
            >
              Yardım müraciəti et
            </Link>
          </div>
        ) : (
          <PatientFeed
            initialPatients={list}
            initialHasMore={hasMore}
            isGuest={isGuest}
          />
        )}
      </main>

      <Footer />
      <RecentDonorsFeed />
    </>
  );
}
