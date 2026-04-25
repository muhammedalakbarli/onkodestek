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
  isReviewed: boolean;
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

export default function VolunteersPage() {
  const [list, setList]     = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/volunteer");
    if (res.ok) setList(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleReviewed(id: number, current: boolean) {
    setToggling(id);
    const res = await fetch(`/api/admin/volunteers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isReviewed: !current }),
    });
    if (res.ok) {
      const updated: Volunteer = await res.json();
      setList((prev) => prev.map((v) => v.id === id ? updated : v));
    }
    setToggling(null);
  }

  const newCount = list.filter((v) => !v.isReviewed).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
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
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">Yüklənir...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">Hələlik könüllü müraciəti yoxdur.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((v) => (
            <div key={v.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-colors ${
              v.isReviewed ? "border-slate-100" : "border-teal-200"
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
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
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <a href={`mailto:${v.email}`} className="hover:text-teal-600 transition-colors">{v.email}</a>
                    {v.phone && <a href={`tel:${v.phone}`} className="hover:text-teal-600 transition-colors">{v.phone}</a>}
                  </div>
                  {v.message && (
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{v.message}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-xs text-slate-400">{formatDate(v.createdAt)}</p>
                  <button
                    onClick={() => toggleReviewed(v.id, v.isReviewed)}
                    disabled={toggling === v.id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                      v.isReviewed
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    {toggling === v.id ? "..." : v.isReviewed ? "Baxılmış" : "Baxıldı işarələ"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
