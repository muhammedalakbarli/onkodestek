"use client";

import { useState, useMemo } from "react";
import PatientCard from "./PatientCard";
import type { Patient } from "@/drizzle/schema";

const PAGE_SIZE = 12;

const STATUS_FILTERS = [
  { value: "all",    label: "Hamısı" },
  { value: "active", label: "Aktiv" },
  { value: "urgent", label: "🔴 Tez çatan" },
  { value: "funded", label: "Tamamlandı" },
];

export default function PatientFilter({ patients, isGuest }: { patients: Patient[]; isGuest?: boolean }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage]     = useState(1);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const pct = parseFloat(String(p.goalAmount)) > 0
        ? parseFloat(String(p.collectedAmount)) / parseFloat(String(p.goalAmount))
        : 0;
      const isUrgent = p.status === "active" && pct >= 0.7;

      const matchStatus =
        status === "all"    ? true :
        status === "urgent" ? isUrgent :
        p.status === status;

      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q) ||
        (p.hospitalName?.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  }, [patients, search, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeFilter(fn: () => void) {
    fn();
    setPage(1);
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Ad, diaqnoz və ya xəstəxana axtar..."
            value={search}
            onChange={(e) => changeFilter(() => setSearch(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => changeFilter(() => setStatus(f.value))}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                status === f.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nəticələr */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm">Heç bir nəticə tapılmadı.</p>
          <button
            onClick={() => changeFilter(() => { setSearch(""); setStatus("all"); })}
            className="mt-3 text-blue-600 text-sm hover:underline"
          >
            Filteri sıfırla
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((p) => (
              <PatientCard key={p.id} patient={p} isGuest={isGuest} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors">
                ← Əvvəlki
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`e${i}`} className="px-1 text-slate-400 text-sm">…</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p as number)}
                      className={`w-9 h-9 text-sm font-semibold rounded-xl transition-colors ${
                        p === page
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400"
                      }`}>
                      {p}
                    </button>
                  )
                )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors">
                Növbəti →
              </button>
            </div>
          )}

          <p className="text-xs text-slate-400 text-center mt-3">
            {filtered.length} nəticədən {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} göstərilir
          </p>
        </>
      )}
    </div>
  );
}
