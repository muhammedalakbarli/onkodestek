import Link from "next/link";
import { formatCurrency, calcProgress } from "@/lib/utils";
import ProgressBar from "./ProgressBar";
import DonationModal from "./DonationModal";
import type { Patient } from "@/drizzle/schema";

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  pending:  { label: "Yoxlanılır",    dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200" },
  verified: { label: "Yoxlanıldı",   dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
  active:   { label: "Aktiv",        dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  funded:   { label: "Tamamlandı",   dot: "bg-violet-400",  badge: "bg-violet-50 text-violet-700 border-violet-200" },
  closed:   { label: "Bağlandı",     dot: "bg-slate-400",   badge: "bg-slate-50 text-slate-600 border-slate-200" },
};

// Avatar rəngləri — ada görə sabit rəng seçir
const AVATAR_COLORS = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-rose-400 to-rose-600",
  "from-orange-400 to-orange-600",
  "from-cyan-400 to-cyan-600",
];

function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function PatientCard({ patient, isGuest }: { patient: Patient; isGuest?: boolean }) {
  const status = STATUS_CONFIG[patient.status] ?? STATUS_CONFIG.pending;
  const pct = calcProgress(patient.collectedAmount, patient.goalAmount);
  const avatarColor = getAvatarColor(patient.fullName);

  return (
    <div className="flex flex-col">
      <Link href={`/patients/${patient.id}`} className="block group flex-1">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">

        {/* Yuxarı rəngli zolaq */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${pct >= 100 ? "from-emerald-400 to-emerald-600" : "from-blue-500 to-violet-500"}`} />

        <div className="p-5 flex flex-col gap-4 flex-1">
          {/* Ad + status */}
          <div className="flex items-start gap-3">
            {patient.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={patient.photoUrl}
                alt=""
                className={`w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm transition-all ${isGuest ? "blur-md" : ""}`}
              />
            ) : (
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm`}>
                {isGuest ? "?" : patient.fullName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors select-none ${isGuest ? "blur-sm" : ""}`}>
                  {patient.fullName}
                </p>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${status.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} inline-block`} />
                  {status.label}
                </span>
              </div>
              <p className={`text-xs text-slate-500 mt-0.5 leading-relaxed select-none ${isGuest ? "blur-sm" : ""}`}>
                {patient.diagnosis}
              </p>
            </div>
          </div>

          {/* Hekayə */}
          {patient.story && (
            <p className={`text-sm text-slate-600 leading-relaxed line-clamp-2 flex-1 select-none ${isGuest ? "blur-sm" : ""}`}>
              {patient.story}
            </p>
          )}

          {/* Məbləğ + progress */}
          <div className="mt-auto">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs text-slate-400 font-medium">Toplanmış vəsait</span>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">{formatCurrency(patient.collectedAmount)}</span>
                <span className="text-xs text-slate-400 ml-1">/ {formatCurrency(patient.goalAmount)}</span>
              </div>
            </div>
            <ProgressBar
              collected={patient.collectedAmount}
              goal={patient.goalAmount}
              showLabel={false}
              size="sm"
            />
            <p className="text-xs text-right mt-1 font-medium text-slate-400">{pct}%</p>
          </div>

          {/* Xəstəxana */}
          {patient.hospitalName && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-50">
              <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-xs text-slate-400 truncate">{patient.hospitalName}</p>
            </div>
          )}
        </div>
      </div>
      </Link>
      {patient.status === "active" && (
        <div className="mt-2">
          <DonationModal patientName={patient.fullName} trackId={patient.trackId} />
        </div>
      )}
    </div>
  );
}
