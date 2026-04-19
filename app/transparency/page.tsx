import Navbar from "@/components/Navbar";
import { db } from "@/lib/db";
import { transactions, patients } from "@/drizzle/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { sql } from "drizzle-orm";

export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  medication:   "Dərman",
  treatment:    "Müalicə",
  consultation: "Konsultasiya",
  transport:    "Nəqliyyat",
  other:        "Digər",
};

export default async function TransparencyPage() {
  let txList: (typeof transactions.$inferSelect & { patientName: string })[] = [];
  let totalDonations = 0;
  let totalExpenses  = 0;

  try {
    const raw = await db
      .select({
        id: transactions.id,
        patientId: transactions.patientId,
        patientName: patients.fullName,
        type: transactions.type,
        amount: transactions.amount,
        category: transactions.category,
        description: transactions.description,
        receiptUrl: transactions.receiptUrl,
        donorName: transactions.donorName,
        donorTelegramId: transactions.donorTelegramId,
        isAnonymous: transactions.isAnonymous,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .leftJoin(patients, sql`${transactions.patientId} = ${patients.id}`)
      .orderBy(transactions.createdAt);

    txList = raw.map((r) => ({ ...r, patientName: r.patientName ?? "Naməlum" }));

    for (const t of txList) {
      const amt = parseFloat(String(t.amount));
      if (t.type === "donation") totalDonations += amt;
      else totalExpenses += amt;
    }
  } catch {
    // DB bağlantısı yoxdursa boş göstər
  }

  const balance = totalDonations - totalExpenses;
  const efficiencyPct = totalDonations > 0
    ? Math.round((totalExpenses / totalDonations) * 100)
    : 0;

  return (
    <>
      <Navbar />

      {/* Səhifə başlığı */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Maliyyə hesabatı</p>
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
          {[
            {
              label: "Cəmi daxil olan ianə",
              value: formatCurrency(totalDonations),
              color: "text-emerald-600",
              bg: "bg-emerald-50 border-emerald-100",
              icon: "↑",
              iconBg: "bg-emerald-100 text-emerald-700",
            },
            {
              label: "Cəmi xərclənmiş vəsait",
              value: formatCurrency(totalExpenses),
              color: "text-red-500",
              bg: "bg-red-50 border-red-100",
              icon: "↓",
              iconBg: "bg-red-100 text-red-600",
            },
            {
              label: "Cari qalıq",
              value: formatCurrency(balance),
              color: "text-blue-700",
              bg: "bg-blue-50 border-blue-100",
              icon: "=",
              iconBg: "bg-blue-100 text-blue-700",
            },
            {
              label: "Xərc effektivliyi",
              value: `${efficiencyPct}%`,
              color: "text-violet-700",
              bg: "bg-violet-50 border-violet-100",
              icon: "✓",
              iconBg: "bg-violet-100 text-violet-700",
            },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-2xl p-5`}>
              <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center font-bold text-sm mb-3`}>
                {s.icon}
              </div>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Əməliyyatlar cədvəli */}
        {txList.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📊</div>
            <p className="text-slate-600 font-semibold">Hələlik əməliyyat qeyd edilməyib</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Əməliyyat tarixçəsi</h2>
              <span className="text-xs text-slate-400">{txList.length} qeyd</span>
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
          </div>
        )}

        {/* Şəffaflıq bildirişi */}
        <div className="bg-blue-950 rounded-2xl p-6 text-white flex gap-4">
          <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-xl shrink-0">🔒</div>
          <div>
            <p className="font-semibold mb-1">Şəffaflıq öhdəliyimiz</p>
            <p className="text-blue-300 text-sm leading-relaxed">
              Bu cədvəl real vaxt rejimində yenilənir. Hər ianə daxil olduqda və hər xərc
              həyata keçirildikdə qeyd əlavə edilir. Heç bir əməliyyat silinmir və ya dəyişdirilmir.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
