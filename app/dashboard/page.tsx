import Link from "next/link";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { formatCurrency, formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function DashboardPage() {
  let stats = {
    totalPatients: 0,
    pendingPatients: 0,
    activePatients: 0,
    fundedPatients: 0,
    totalDonations: 0,
    totalExpenses: 0,
    balance: 0,
  };

  let recentPatients: (typeof patients.$inferSelect)[] = [];
  let recentTx: (typeof transactions.$inferSelect)[] = [];

  try {
    const [ps] = await db.select({
      total:   sql<number>`count(*)`,
      pending: sql<number>`count(*) filter (where status = 'pending')`,
      active:  sql<number>`count(*) filter (where status = 'active')`,
      funded:  sql<number>`count(*) filter (where status = 'funded')`,
    }).from(patients);

    const [ts] = await db.select({
      donations: sql<number>`coalesce(sum(amount) filter (where type = 'donation'), 0)`,
      expenses:  sql<number>`coalesce(sum(amount) filter (where type = 'expense'), 0)`,
    }).from(transactions);

    stats = {
      totalPatients:   Number(ps.total),
      pendingPatients: Number(ps.pending),
      activePatients:  Number(ps.active),
      fundedPatients:  Number(ps.funded),
      totalDonations:  Number(ts.donations),
      totalExpenses:   Number(ts.expenses),
      balance:         Number(ts.donations) - Number(ts.expenses),
    };

    recentPatients = await db.select().from(patients)
      .orderBy(sql`created_at desc`).limit(8);

    recentTx = await db.select().from(transactions)
      .orderBy(sql`created_at desc`).limit(8);
  } catch {
    // DB bağlantısı yoxdursa boş göstər
  }

  const STATUS_BADGE: Record<string, string> = {
    pending:  "bg-amber-50 text-amber-700 border-amber-200",
    verified: "bg-blue-50 text-blue-700 border-blue-200",
    active:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    funded:   "bg-violet-50 text-violet-700 border-violet-200",
    closed:   "bg-slate-100 text-slate-500 border-slate-200",
  };
  const STATUS_LABEL: Record<string, string> = {
    pending:  "Gözləyir",
    verified: "Yoxlanıldı",
    active:   "Aktiv",
    funded:   "Tamamlandı",
    closed:   "Bağlandı",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">İcmal</h1>
        <p className="text-slate-500 text-sm mt-1">Platformanın ümumi vəziyyəti</p>
      </div>

      {/* Stat kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Ümumi müraciət",   value: stats.totalPatients,   icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", bg: "bg-blue-100 text-blue-600", border: "border-blue-100" },
          { label: "Yoxlanılır",        value: stats.pendingPatients, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", bg: "bg-amber-100 text-amber-600", border: "border-amber-100" },
          { label: "Aktiv yığım",       value: stats.activePatients,  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", bg: "bg-emerald-100 text-emerald-600", border: "border-emerald-100" },
          { label: "Tamamlandı",        value: stats.fundedPatients,  icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", bg: "bg-violet-100 text-violet-600", border: "border-violet-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl border ${s.border} shadow-sm p-5`}>
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Maliyyə xülasəsi */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Cəmi toplanıb</p>
          <p className="text-2xl font-extrabold text-emerald-700">{formatCurrency(stats.totalDonations)}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Cəmi xərclənib</p>
          <p className="text-2xl font-extrabold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Cari qalıq</p>
          <p className="text-2xl font-extrabold text-blue-700">{formatCurrency(stats.balance)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Son müraciətlər */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="font-bold text-slate-900 text-sm">Son müraciətlər</h2>
            <Link href="/dashboard/patients" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
              Hamısı →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentPatients.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">Hələlik yoxdur.</p>
            ) : recentPatients.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/patients/${p.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{p.fullName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.diagnosis}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_BADGE[p.status] ?? STATUS_BADGE.pending}`}>
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Son əməliyyatlar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="font-bold text-slate-900 text-sm">Son əməliyyatlar</h2>
            <Link href="/dashboard/transactions" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
              Hamısı →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentTx.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">Hələlik yoxdur.</p>
            ) : recentTx.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {t.type === "donation"
                      ? (t.isAnonymous ? "Anonim ianəçi" : (t.donorName ?? "İanəçi"))
                      : (t.description ?? "Xərc")}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(t.createdAt)}</p>
                </div>
                <span className={`text-sm font-bold ${t.type === "donation" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.type === "donation" ? "+" : "−"}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
