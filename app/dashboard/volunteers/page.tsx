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

function VolunteerCard({ v, onUpdate }: { v: Volunteer; onUpdate: (updated: Volunteer) => void }) {
  const [toggling, setToggling] = useState(false);
  const [note, setNote]         = useState(v.adminNote ?? "");
  const [saving, setSaving]     = useState(false);

  async function patch(body: object) {
    const res = await fetch(`/api/admin/volunteers/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) onUpdate(await res.json());
  }

  async function toggleReviewed() {
    setToggling(true);
    await patch({ isReviewed: !v.isReviewed });
    setToggling(false);
  }

  async function saveNote() {
    if (note === (v.adminNote ?? "")) return;
    setSaving(true);
    await patch({ adminNote: note || null });
    setSaving(false);
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${
      v.isReviewed ? "border-slate-100" : "border-teal-200"
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
              {!v.isReviewed && (
                <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                  Yeni
                </span>
              )}
            </div>

            {/* Əlaqə */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-2">
              <a href={`mailto:${v.email}`} className="hover:text-teal-600 transition-colors">{v.email}</a>
              {v.phone && <a href={`tel:${v.phone}`} className="hover:text-teal-600 transition-colors">{v.phone}</a>}
            </div>

            {/* Mesaj */}
            {v.message && (
              <p className="text-sm text-slate-600 leading-relaxed mb-2">{v.message}</p>
            )}

            {/* CV linki */}
            {v.cvUrl && (
              <a
                href={v.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
                CV / Müraciət məktubu
              </a>
            )}
          </div>

          {/* Sağ tərəf: tarix + toggle */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <p className="text-xs text-slate-400">{formatDate(v.createdAt)}</p>
            <button
              onClick={toggleReviewed}
              disabled={toggling}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                v.isReviewed
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {toggling ? "..." : v.isReviewed ? "✓ Baxılmış" : "Baxıldı işarələ"}
            </button>
          </div>
        </div>

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
  const [filter, setFilter]   = useState<"all" | "new" | "reviewed">("all");

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

  const newCount = list.filter((v) => !v.isReviewed).length;
  const filtered = list.filter((v) => {
    if (filter === "new")      return !v.isReviewed;
    if (filter === "reviewed") return v.isReviewed;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
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

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(["all", "new", "reviewed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              filter === f
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {f === "all" ? "Hamısı" : f === "new" ? "Yeni" : "Baxılmış"}
          </button>
        ))}
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
