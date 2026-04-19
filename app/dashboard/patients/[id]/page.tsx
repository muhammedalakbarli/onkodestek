import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { formatCurrency, formatDate, calcProgress } from "@/lib/utils";
import PatientActions from "./PatientActions";

export const revalidate = 0;

const STATUS_LABEL: Record<string, string> = {
  pending:  "Yoxlanılır",
  verified: "Yoxlanıldı",
  active:   "Aktiv",
  funded:   "Tamamlandı",
  closed:   "Bağlandı",
};
const CATEGORY_LABELS: Record<string, string> = {
  medication:   "Dərman",
  treatment:    "Müalicə",
  consultation: "Konsultasiya",
  transport:    "Nəqliyyat",
  other:        "Digər",
};

export default async function AdminPatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let patient: typeof patients.$inferSelect | undefined;
  let txList: (typeof transactions.$inferSelect)[] = [];

  try {
    [patient] = await db.select().from(patients).where(eq(patients.id, parseInt(id)));
    if (!patient) notFound();
    txList = await db.select().from(transactions)
      .where(eq(transactions.patientId, patient.id))
      .orderBy(sql`created_at desc`);
  } catch {
    notFound();
  }

  const donations   = txList.filter((t) => t.type === "donation");
  const expenses    = txList.filter((t) => t.type === "expense");
  const pct         = calcProgress(patient.collectedAmount, patient.goalAmount);
  const totalSpent  = expenses.reduce((s, t) => s + parseFloat(String(t.amount)), 0);

  return (
    <div className="p-8 max-w-5xl">
      {/* Geri */}
      <Link
        href="/dashboard/patients"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Müraciətlərə qayıt
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Sol sütun: məlumatlar */}
        <div className="lg:col-span-2 space-y-5">

          {/* Xəstə info kartı */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-xl shrink-0">
                {patient.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h1 className="text-xl font-bold text-slate-900">{patient.fullName}</h1>
                  {patient.age && <span className="text-sm text-slate-400">{patient.age} yaş</span>}
                </div>
                <p className="text-slate-600 text-sm">{patient.diagnosis}</p>
                {patient.hospitalName && (
                  <p className="text-xs text-slate-400 mt-1">🏥 {patient.hospitalName}</p>
                )}
                {patient.contactPhone && (
                  <p className="text-xs text-slate-400 mt-0.5">📞 {patient.contactPhone}</p>
                )}
              </div>
            </div>

            {patient.story && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5">
                <p className="text-sm text-slate-600 leading-relaxed italic">"{patient.story}"</p>
              </div>
            )}

            {/* Progress */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Toplanmış vəsait</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(patient.collectedAmount)} / {formatCurrency(patient.goalAmount)}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 100
                      ? "linear-gradient(90deg, #059669, #10b981)"
                      : "linear-gradient(90deg, #2563eb, #7c3aed)",
                  }}
                />
              </div>
              <p className="text-xs text-right mt-1 text-slate-400">{pct}%</p>
            </div>

            {/* Maliyyə xülasəsi */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: "Daxil olan", value: formatCurrency(patient.collectedAmount), color: "text-emerald-600" },
                { label: "Xərclənib",  value: formatCurrency(totalSpent),              color: "text-red-500" },
                { label: "Qalıq",      value: formatCurrency(parseFloat(String(patient.collectedAmount)) - totalSpent), color: "text-blue-600" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Əməliyyatlar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50">
              <h2 className="font-bold text-slate-900 text-sm">Əməliyyat tarixçəsi ({txList.length})</h2>
            </div>
            <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
              {txList.length === 0 ? (
                <p className="px-5 py-8 text-sm text-slate-400 text-center">Hələlik əməliyyat yoxdur.</p>
              ) : txList.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      t.type === "donation" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {t.type === "donation" ? "↑" : "↓"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {t.type === "donation"
                          ? (t.isAnonymous ? "Anonim ianəçi" : (t.donorName ?? "İanəçi"))
                          : (t.category ? CATEGORY_LABELS[t.category] : "Xərc")}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {t.receiptUrl && (
                      <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-700">Qəbz</a>
                    )}
                    <span className={`text-sm font-bold ${t.type === "donation" ? "text-emerald-600" : "text-red-500"}`}>
                      {t.type === "donation" ? "+" : "−"}{formatCurrency(t.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ sütun: əməliyyatlar */}
        <div>
          <PatientActions patient={patient} />
        </div>
      </div>
    </div>
  );
}
