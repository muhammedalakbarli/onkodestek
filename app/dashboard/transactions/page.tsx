import { db } from "@/lib/db";
import { transactions, patients } from "@/drizzle/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { sql } from "drizzle-orm";

export const revalidate = 0;

const CATEGORY_LABELS: Record<string, string> = {
  medication:   "Dərman",
  treatment:    "Müalicə",
  consultation: "Konsultasiya",
  transport:    "Nəqliyyat",
  other:        "Digər",
};

export default async function AdminTransactionsPage() {
  type TxRow = typeof transactions.$inferSelect & { patientName: string };
  let list: TxRow[] = [];
  let totalDonations = 0;
  let totalExpenses  = 0;

  try {
    const raw = await db
      .select({
        id:             transactions.id,
        patientId:      transactions.patientId,
        patientName:    patients.fullName,
        type:           transactions.type,
        amount:         transactions.amount,
        category:       transactions.category,
        description:    transactions.description,
        receiptUrl:     transactions.receiptUrl,
        donorUserId:     transactions.donorUserId,
        donorName:      transactions.donorName,
        donorTelegramId: transactions.donorTelegramId,
        isAnonymous:    transactions.isAnonymous,
        createdAt:      transactions.createdAt,
      })
      .from(transactions)
      .leftJoin(patients, sql`${transactions.patientId} = ${patients.id}`)
      .orderBy(sql`${transactions.createdAt} desc`);

    list = raw.map((r) => ({ ...r, patientName: r.patientName ?? "Naməlum" }));
    for (const t of list) {
      const amt = parseFloat(String(t.amount));
      if (t.type === "donation") totalDonations += amt;
      else totalExpenses += amt;
    }
  } catch { /* boş */ }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Maliyyə əməliyyatları</h1>
        <p className="text-slate-500 text-sm mt-1">Bütün ianə və xərclərin tam tarixçəsi</p>
      </div>

      {/* Xülasə */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Cəmi ianə</p>
          <p className="text-2xl font-extrabold text-emerald-700">{formatCurrency(totalDonations)}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Cəmi xərc</p>
          <p className="text-2xl font-extrabold text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Cari qalıq</p>
          <p className="text-2xl font-extrabold text-blue-700">
            {formatCurrency(totalDonations - totalExpenses)}
          </p>
        </div>
      </div>

      {/* Cədvəl */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <h2 className="font-bold text-slate-900 text-sm">Tarixçə</h2>
          <span className="text-xs text-slate-400">{list.length} qeyd</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Tarix", "Xəstə", "Növ", "Təfərrüat", "Məbləğ", "Sənəd"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    Hələlik əməliyyat yoxdur.
                  </td>
                </tr>
              ) : list.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(t.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-700 whitespace-nowrap">
                    {t.patientName}
                  </td>
                  <td className="px-5 py-3.5">
                    {t.type === "donation" ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> İanə
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-orange-200">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                        {t.category ? CATEGORY_LABELS[t.category] : "Xərc"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-[180px] truncate">
                    {t.type === "donation"
                      ? t.isAnonymous ? "Anonim" : (t.donorName ?? "—")
                      : (t.description ?? "—")}
                  </td>
                  <td className={`px-5 py-3.5 font-bold whitespace-nowrap ${
                    t.type === "donation" ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {t.type === "donation" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {t.receiptUrl ? (
                      <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        Bax ↗
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
    </div>
  );
}
