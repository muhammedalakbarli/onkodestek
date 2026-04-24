import { db } from "@/lib/db";
import { patients, transactions } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  // ID yoxdursa — boş axtarış forması göstər
  if (!id) {
    return <TrackForm />;
  }

  const trackId = id.toUpperCase().trim();

  // DB-dən xəstəni tap
  const [patient] = await db
    .select()
    .from(patients)
    .where(eq(patients.trackId, trackId));

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Müraciət tapılmadı</h1>
          <p className="text-sm text-slate-500 mb-6">
            <strong>{trackId}</strong> izləmə koduna uyğun müraciət tapılmadı.
            Kodu düzgün daxil etdiyinizə əmin olun.
          </p>
          <Link
            href="/track"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Yenidən axtar
          </Link>
        </div>
      </div>
    );
  }

  // Xəstənin tranzaksiyalarını çək
  const txList = await db
    .select()
    .from(transactions)
    .where(eq(transactions.patientId, patient.id))
    .orderBy(desc(transactions.createdAt));

  const donations = txList.filter((t) => t.type === "donation");
  const expenses  = txList.filter((t) => t.type === "expense");
  const collected = parseFloat(patient.collectedAmount as string);
  const goal      = parseFloat(patient.goalAmount as string);
  const percent   = goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : 0;

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending:  { label: "Gözləyir",        color: "bg-amber-100 text-amber-700" },
    verified: { label: "Sənəd yoxlandı",  color: "bg-blue-100 text-blue-700" },
    active:   { label: "Aktiv yığım",     color: "bg-emerald-100 text-emerald-700" },
    funded:   { label: "Maliyyələşdi",    color: "bg-purple-100 text-purple-700" },
    closed:   { label: "Bağlandı",        color: "bg-slate-100 text-slate-600" },
  };

  const statusInfo = statusLabels[patient.status] ?? statusLabels.pending;

  const categoryLabels: Record<string, string> = {
    medication:   "Dərman",
    treatment:    "Müalicə",
    consultation: "Konsultasiya",
    transport:    "Nəqliyyat",
    other:        "Digər",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Müraciət izləmə
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">{patient.fullName}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">{patient.trackId}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* İrəliləyiş */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-0.5">Yığılan məbləğ</p>
              <p className="text-2xl font-extrabold text-slate-900">
                {collected.toLocaleString("az-AZ")}
                <span className="text-sm font-medium text-slate-400 ml-1">₼</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium mb-0.5">Hədəf</p>
              <p className="text-sm font-bold text-slate-600">
                {goal.toLocaleString("az-AZ")} ₼
              </p>
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${percent >= 100 ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-blue-600"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">{percent}% tamamlandı</p>
        </div>

        {/* Xəstə haqqında */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-3">Xəstə haqqında</h2>
          <div className="space-y-2">
            {patient.diagnosis && (
              <Row label="Diaqnoz" value={patient.diagnosis} />
            )}
            {patient.age && (
              <Row label="Yaş" value={`${patient.age} yaş`} />
            )}
            {patient.hospitalName && (
              <Row label="Xəstəxana" value={patient.hospitalName} />
            )}
          </div>
          {patient.story && (
            <p className="text-sm text-slate-600 mt-4 leading-relaxed border-t border-slate-100 pt-4">
              {patient.story}
            </p>
          )}
        </div>

        {/* İanələr */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-700">
              İanələr
              <span className="ml-2 text-xs font-medium text-slate-400">({donations.length})</span>
            </h2>
          </div>
          {donations.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-400 text-center">Hələ ianə daxil olmayıb</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {donations.map((d) => (
                <li key={d.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {d.isAnonymous ? "Anonim donor" : (d.donorName ?? "Naməlum")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString("az-AZ", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">
                    +{parseFloat(d.amount as string).toLocaleString("az-AZ")} ₼
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Xərclər */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-700">
              Xərclər
              <span className="ml-2 text-xs font-medium text-slate-400">({expenses.length})</span>
            </h2>
          </div>
          {expenses.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-400 text-center">Hələ xərc qeydə alınmayıb</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {expenses.map((e) => (
                <li key={e.id} className="flex items-start justify-between px-5 py-3.5 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {e.category ? (categoryLabels[e.category] ?? e.category) : "Digər"}
                      </span>
                    </div>
                    {e.description && (
                      <p className="text-sm text-slate-700 mt-1">{e.description}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(e.createdAt).toLocaleDateString("az-AZ", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                    {e.receiptUrl && (
                      <a
                        href={e.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-700 mt-1 inline-flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Qəbz
                      </a>
                    )}
                  </div>
                  <p className="text-sm font-bold text-red-500 shrink-0">
                    -{parseFloat(e.amount as string).toLocaleString("az-AZ")} ₼
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs font-medium text-slate-400 w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
}

function TrackForm() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-1">Müraciəti izlə</h1>
        <p className="text-sm text-slate-500 mb-6">
          Telegram botdan aldığınız izləmə kodunu daxil edin
        </p>
        <form action="/track" method="GET">
          <input
            type="text"
            name="id"
            placeholder="OKD-XXXXXX"
            maxLength={12}
            autoFocus
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 uppercase font-mono mb-3"
          />
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Axtar
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-4 text-center">
          İzləmə kodunu Telegram botumuzdan müraciət edəndə alırsınız
        </p>
      </div>
    </div>
  );
}
