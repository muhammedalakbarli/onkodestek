import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PhotoLightbox from "@/components/PhotoLightbox";
import ProgressBar from "@/components/ProgressBar";
import DonationModal from "@/components/DonationModal";
import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { formatCurrency, formatDate, calcProgress } from "@/lib/utils";

export const revalidate = 60;

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  pending:  { label: "Yoxlanılır",  badge: "bg-amber-50 text-amber-700 border-amber-200" },
  verified: { label: "Yoxlanıldı", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  active:   { label: "Aktiv",      badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  funded:   { label: "Tamamlandı", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  closed:   { label: "Bağlandı",   badge: "bg-slate-50 text-slate-600 border-slate-200" },
};

const CATEGORY_LABELS: Record<string, string> = {
  medication:   "Dərman",
  treatment:    "Müalicə",
  consultation: "Konsultasiya",
  transport:    "Nəqliyyat",
  other:        "Digər",
};

const AVATAR_COLORS = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-rose-400 to-rose-600",
  "from-orange-400 to-orange-600",
];

export default async function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let patient;
  let txList: (typeof transactions.$inferSelect)[] = [];

  try {
    [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, parseInt(id)));

    if (!patient) notFound();

    txList = await db
      .select()
      .from(transactions)
      .where(eq(transactions.patientId, patient.id))
      .orderBy(transactions.createdAt);
  } catch {
    notFound();
  }

  const donations = txList.filter((t) => t.type === "donation");
  const expenses  = txList.filter((t) => t.type === "expense");
  const pct       = calcProgress(patient.collectedAmount, patient.goalAmount);
  const status    = STATUS_CONFIG[patient.status] ?? STATUS_CONFIG.pending;
  const avatarColor = AVATAR_COLORS[patient.fullName.charCodeAt(0) % AVATAR_COLORS.length];

  const totalExpenses = expenses.reduce((s, t) => s + parseFloat(String(t.amount)), 0);

  return (
    <>
      <Navbar />

      {/* Geri düyməsi */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/patients"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Xəstələrə qayıt
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Xəstə məlumat kartı ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Yuxarı rəngli zolaq */}
          <div className={`h-2 w-full bg-gradient-to-r ${pct >= 100 ? "from-emerald-400 to-emerald-600" : "from-blue-500 to-violet-500"}`} />

          <div className="p-6 md:p-8">
            <div className="flex items-start gap-5">
              {patient.photoUrl ? (
                <PhotoLightbox
                  src={patient.photoUrl}
                  alt={patient.fullName}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-md"
                />
              ) : (
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-extrabold text-2xl shrink-0 shadow-md`}>
                  {patient.fullName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{patient.fullName}</h1>
                  {patient.age && (
                    <span className="text-sm text-slate-400 font-normal">{patient.age} yaş</span>
                  )}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.badge}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{patient.diagnosis}</p>
                {patient.hospitalName && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm text-slate-500">{patient.hospitalName}</span>
                  </div>
                )}
              </div>
            </div>

            {patient.story && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-600 text-sm leading-relaxed italic">"{patient.story}"</p>
              </div>
            )}

            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-sm font-semibold text-slate-600">Toplanmış vəsait</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">{formatCurrency(patient.collectedAmount)}</span>
                  <span className="text-sm text-slate-400 ml-1.5">/ {formatCurrency(patient.goalAmount)} hədəf</span>
                </div>
              </div>
              <ProgressBar collected={patient.collectedAmount} goal={patient.goalAmount} />
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Müraciət tarixi: {formatDate(patient.createdAt)}
            </p>

            {patient.status === "active" && (
              <div className="mt-5">
                <DonationModal
                  patientName={patient.fullName}
                  trackId={patient.trackId}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Maliyyə xülasəsi ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Daxil olan ianələr", value: formatCurrency(patient.collectedAmount), color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "İstifadə olunan vəsait", value: formatCurrency(totalExpenses), color: "text-red-500", bg: "bg-red-50 border-red-100" },
            { label: "Cari qalıq", value: formatCurrency(parseFloat(String(patient.collectedAmount)) - totalExpenses), color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-xl p-4 text-center`}>
              <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── İanə və xərc siyahıları ─────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* İanələr */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">💙</span>
                İanələr
              </h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {donations.length} ianə
              </span>
            </div>
            <div className="p-5">
              {donations.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Hələlik ianə daxil olmayıb.</p>
              ) : (
                <div className="space-y-3">
                  {donations.map((t) => (
                    <div key={t.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {t.isAnonymous ? "Anonim ianəçi" : (t.donorName ?? "İanəçi")}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(t.createdAt)}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">
                        +{formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Xərclər */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center text-sm">🧾</span>
                Xərclər
              </h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {expenses.length} əməliyyat
              </span>
            </div>
            <div className="p-5">
              {expenses.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Hələlik xərc qeyd edilməyib.</p>
              ) : (
                <div className="space-y-3">
                  {expenses.map((t) => (
                    <div key={t.id} className="flex justify-between items-start py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {t.category ? CATEGORY_LABELS[t.category] : "Digər"}
                        </p>
                        {t.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(t.createdAt)}</p>
                        {t.receiptUrl && (
                          <a
                            href={t.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-700 font-medium mt-0.5 inline-block transition-colors"
                          >
                            Qəbzə bax →
                          </a>
                        )}
                      </div>
                      <span className="text-sm font-bold text-red-500 shrink-0 ml-3">
                        -{formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
