import Link from "next/link";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export const revalidate = 0;

const STATUS_BADGE: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 border-amber-200",
  verified: "bg-blue-50 text-blue-700 border-blue-200",
  active:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  funded:   "bg-violet-50 text-violet-700 border-violet-200",
  closed:   "bg-slate-100 text-slate-500 border-slate-200",
};
const STATUS_LABEL: Record<string, string> = {
  pending:  "Yoxlanılır",
  verified: "Yoxlanıldı",
  active:   "Aktiv",
  funded:   "Tamamlandı",
  closed:   "Bağlandı",
};

export default async function AdminPatientsPage() {
  let list: (typeof patients.$inferSelect)[] = [];
  let counts = { pending: 0, active: 0, funded: 0, total: 0 };

  try {
    list = await db.select().from(patients).orderBy(sql`created_at desc`);
    counts = {
      total:   list.length,
      pending: list.filter((p) => p.status === "pending").length,
      active:  list.filter((p) => p.status === "active").length,
      funded:  list.filter((p) => p.status === "funded").length,
    };
  } catch { /* boş */ }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Müraciətlər</h1>
        <p className="text-slate-500 text-sm mt-1">Bütün xəstə müraciətlərini idarə edin</p>
      </div>

      {/* Sayaçlar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Cəmi",       value: counts.total,   color: "text-slate-700",   bg: "bg-slate-50 border-slate-200" },
          { label: "Gözləyir",   value: counts.pending, color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
          { label: "Aktiv",      value: counts.active,  color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Tamamlandı", value: counts.funded,  color: "text-violet-700",  bg: "bg-violet-50 border-violet-200" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 text-center`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cədvəl */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Ad / Diaqnoz", "Status", "Hədəf", "Toplanıb", "İctimai", "Tarix", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Hələlik müraciət yoxdur.
                  </td>
                </tr>
              ) : list.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{p.fullName}</p>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-[200px] truncate">{p.diagnosis}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_BADGE[p.status] ?? STATUS_BADGE.pending}`}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">
                    {formatCurrency(p.goalAmount)}
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-600 whitespace-nowrap">
                    {formatCurrency(p.collectedAmount)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {p.isPublic
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" strokeWidth={2.5} />
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(p.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/patients/${p.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
                    >
                      İdarə et →
                    </Link>
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
