"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";

type Volunteer = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  area: string;
  message: string | null;
  cvUrl: string | null;
  isReviewed: boolean;
  status: string;
  adminNote: string | null;
  createdAt: string;
};

const AREA_LABELS: Record<string, string> = {
  tibbi:     "Tibbi dəstək",
  hüquqi:    "Hüquqi yardım",
  texniki:   "Texniki dəstək",
  media:     "Media / PR",
  psixoloji: "Psixoloji dəstək",
  digər:     "Digər",
};

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  pending:   { label: "Gözləyir",           badge: "bg-amber-50 text-amber-700 border-amber-200" },
  interview: { label: "Müsahibəyə dəvət",   badge: "bg-blue-50 text-blue-700 border-blue-200" },
  accepted:  { label: "Qəbul edildi",        badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected:  { label: "Rədd edildi",         badge: "bg-red-50 text-red-600 border-red-200" },
};

function VolunteerCard({ v, onUpdate }: { v: Volunteer; onUpdate: (u: Volunteer) => void }) {
  const [note, setNote]     = useState(v.adminNote ?? "");
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  const statusCfg = STATUS_CONFIG[v.status] ?? STATUS_CONFIG.pending;

  async function patch(body: object) {
    const res = await fetch(`/api/admin/volunteers/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) onUpdate(await res.json());
  }

  async function setStatus(status: string) {
    setActing(status);
    await patch({ status });
    setActing(null);
  }

  async function saveNote() {
    if (note === (v.adminNote ?? "")) return;
    setSaving(true);
    await patch({ adminNote: note || null });
    setSaving(false);
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${
      v.status === "pending" && !v.isReviewed ? "border-teal-200" : "border-slate-100"
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Ad + sahə + status */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-semibold text-slate-900">{v.fullName}</p>
              <span className="text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">
                {AREA_LABELS[v.area] ?? v.area}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusCfg.badge}`}>
                {statusCfg.label}
              </span>
              {!v.isReviewed && v.status === "pending" && (
                <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                  Yeni
                </span>
              )}
            </div>

            {/* Əlaqə */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-2">
              <a href={`mailto:${v.email}`} className="hover:text-teal-600 transition-colors">{v.email}</a>
              {v.phone && <a href={`tel:${v.phone}`} className="hover:text-teal-600 transition-colors">{v.phone}</a>}
            </div>

            {v.message && (
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{v.message}</p>
            )}

            {v.cvUrl && (
              <a
                href={v.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                CV yüklə
              </a>
            )}
          </div>

          <p className="text-xs text-slate-400 shrink-0">{formatDate(v.createdAt)}</p>
        </div>

        {/* Aksiya düymələri */}
        {v.status !== "accepted" && v.status !== "rejected" && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-50">
            <button
              onClick={() => setStatus("interview")}
              disabled={acting !== null || v.status === "interview"}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
            >
              {acting === "interview" ? "..." : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Müsahibəyə dəvət et
                </>
              )}
            </button>
            <button
              onClick={() => setStatus("accepted")}
              disabled={acting !== null}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
            >
              {acting === "accepted" ? "..." : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Könüllü seç
                </>
              )}
            </button>
            <button
              onClick={() => setStatus("rejected")}
              disabled={acting !== null}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            >
              {acting === "rejected" ? "..." : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Rədd et
                </>
              )}
            </button>
          </div>
        )}

        {/* Qəbul/rədd olunmuş — yenidən açmaq */}
        {(v.status === "accepted" || v.status === "rejected") && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
            <button
              onClick={() => setStatus("pending")}
              disabled={acting !== null}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              Qərarı geri al
            </button>
          </div>
        )}

        {/* Admin qeydi */}
        <div className="mt-3 pt-3 border-t border-slate-50">
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Admin qeydi</label>
          <div className="flex gap-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={saveNote}
              rows={2}
              placeholder="Daxili qeyd (yalnız admin görür)..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-slate-300"
            />
            <button
              onClick={saveNote}
              disabled={saving || note === (v.adminNote ?? "")}
              className="self-end px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {saving ? "..." : "Saxla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VolunteersPage() {
  const [list, setList]       = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<"all" | "pending" | "interview" | "accepted" | "rejected">("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/volunteer");
    if (res.ok) setList(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function updateOne(updated: Volunteer) {
    setList((prev) => prev.map((v) => v.id === updated.id ? updated : v));
  }

  const counts = {
    all:       list.length,
    pending:   list.filter((v) => v.status === "pending").length,
    interview: list.filter((v) => v.status === "interview").length,
    accepted:  list.filter((v) => v.status === "accepted").length,
    rejected:  list.filter((v) => v.status === "rejected").length,
  };

  const newCount = list.filter((v) => !v.isReviewed).length;
  const filtered = filter === "all" ? list : list.filter((v) => v.status === filter);

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all",       label: `Hamısı (${counts.all})` },
    { key: "pending",   label: `Gözləyir (${counts.pending})` },
    { key: "interview", label: `Müsahibə (${counts.interview})` },
    { key: "accepted",  label: `Qəbul (${counts.accepted})` },
    { key: "rejected",  label: `Rədd (${counts.rejected})` },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Könüllü müraciətləri</h1>
          <p className="text-slate-500 text-sm mt-1">
            Cəmi {list.length} müraciət
            {newCount > 0 && (
              <span className="ml-2 text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                {newCount} yeni
              </span>
            )}
          </p>
        </div>
        <a
          href="/api/admin/export/volunteers"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV ixrac
        </a>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              filter === key
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Email qeydi */}
      <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
        💬 Status dəyişdirildikdə namizədə <strong>avtomatik email</strong> göndərilir.
        SMS üçün əlavə provider (Infobip, MSMS.az) inteqrasiyası tələb olunur.
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">Yüklənir...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">Müraciət tapılmadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => (
            <VolunteerCard key={v.id} v={v} onUpdate={updateOne} />
          ))}
        </div>
      )}
    </div>
  );
}
