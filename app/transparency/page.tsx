import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Şəffaflıq",
  description: "Bütün ianələr və xərclər real vaxtda açıqlanır. Hər qəpiyin hara getdiyini izləyin.",
};

import { db } from "@/lib/db";
import { transactions, patients } from "@/drizzle/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { sql } from "drizzle-orm";

export const revalidate = 60;

const PAGE_SIZE = 20;

const CATEGORY_LABELS: Record<string, string> = {
  medication:   "Dərman",
  treatment:    "Müalicə",
  consultation: "Konsultasiya",
  transport:    "Nəqliyyat",
  other:        "Digər",
};

export default async function TransparencyPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let txList: (typeof transactions.$inferSelect & { patientName: string })[] = [];
  let totalDonations = 0;
  let totalExpenses  = 0;
  let totalCount     = 0;

  try {
    // Aggregate totals — full table scan, lightweight
    const totals = await db
      .select({
        type:   transactions.type,
        amount: sql<string>`sum(${transactions.amount})`,
        count:  sql<number>`count(*)`,
      })
      .from(transactions)
      .groupBy(transactions.type);

    for (const row of totals) {
      const amt = parseFloat(row.amount ?? "0");
      if (row.type === "donation") { totalDonations += amt; totalCount += Number(row.count); }
      else { totalExpenses += amt; totalCount += Number(row.count); }
    }

    // Paginated rows
    const raw = await db
      .select({
        id:              transactions.id,
        patientId:       transactions.patientId,
        patientName:     patients.fullName,
        type:            transactions.type,
        amount:          transactions.amount,
        category:        transactions.category,
        description:     transactions.description,
        receiptUrl:      transactions.receiptUrl,
        donorUserId:     transactions.donorUserId,
        donorName:       transactions.donorName,
        donorTelegramId: transactions.donorTelegramId,
        isAnonymous:     transactions.isAnonymous,
        createdAt:       transactions.createdAt,
      })
      .from(transactions)
      .leftJoin(patients, sql`${transactions.patientId} = ${patients.id}`)
      .orderBy(sql`${transactions.createdAt} desc`)
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE);

    txList = raw.map((r) => ({ ...r, patientName: r.patientName ?? "Naməlum" }));
  } catch {
    // DB bağlantısı yoxdursa boş göstər
  }

  const balance = totalDonations - totalExpenses;
  const efficiencyPct = totalDonations > 0
    ? Math.round((totalExpenses / totalDonations) * 100)
    : 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <Navbar />

      {/* Səhifə başlığı */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-2">Maliyyə hesabatı</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Şəffaflıq</h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Platforma vasitəsilə həyata keçirilən bütün maliyyə əməliyyatları aşağıda sıralanır.
            Hər xərc müvafiq qəbzlə təsdiq edilmişdir.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Xülasə kartları */}
        <div className="grid sm:grid-cols-4 gap-4">

          {/* İanə */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{formatCurrency(totalDonations)}</p>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">Cəmi daxil olan ianə</p>
          </div>

          {/* Xərc */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">Cəmi xərclənmiş vəsait</p>
          </div>

          {/* Qalıq */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{formatCurrency(balance)}</p>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">Cari qalıq</p>
          </div>

          {/* Effektivlik */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{efficiencyPct}%</p>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">Xərc effektivliyi</p>
          </div>

        </div>

        {/* Əməliyyatlar cədvəli */}
        {totalCount === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">Hələlik əməliyyat qeyd edilməyib</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Əməliyyat tarixçəsi</h2>
              <span className="text-xs text-slate-400">{totalCount} qeyd</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Tarix</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Xəstə</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Növ</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Təfərrüat</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide">Məbləğ</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide">Sənəd</th>
                  </tr>
                </thead>
                <tbody>
                  {txList.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/40"}`}
                    >
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(t.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{t.patientName}</td>
                      <td className="px-5 py-3.5">
                        {t.type === "donation" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            İanə
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-200">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                            {t.category ? CATEGORY_LABELS[t.category] : "Xərc"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 max-w-[200px] truncate">
                        {t.type === "donation"
                          ? t.isAnonymous ? "Anonim ianəçi" : (t.donorName ?? "—")
                          : (t.description ?? "—")}
                      </td>
                      <td className={`px-5 py-3.5 text-right font-bold ${
                        t.type === "donation" ? "text-emerald-600" : "text-red-500"
                      }`}>
                        {t.type === "donation" ? "+" : "−"}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {t.receiptUrl ? (
                          <a
                            href={t.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Bax
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              makeHref={(p) => `/transparency?page=${p}`}
            />

            {totalPages > 1 && (
              <p className="text-xs text-slate-400 text-center pb-4">
                {totalCount} qeydin {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)}-i göstərilir
              </p>
            )}
          </div>
        )}

        {/* Şəffaflıq bildirişi */}
        <div className="bg-blue-950 rounded-2xl p-6 text-white flex gap-4">
          <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold mb-1">Şəffaflıq öhdəliyimiz</p>
            <p className="text-blue-300 text-sm leading-relaxed">
              Bu cədvəl real vaxt rejimində yenilənir. Hər ianə daxil olduqda və hər xərc
              həyata keçirildikdə qeyd əlavə edilir. Heç bir əməliyyat silinmir və ya dəyişdirilmir.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
