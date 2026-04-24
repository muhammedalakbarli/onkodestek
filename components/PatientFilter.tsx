"use client";

import { useState, useMemo } from "react";
import PatientCard from "./PatientCard";
import type { Patient } from "@/drizzle/schema";

const STATUS_FILTERS = [
  { value: "all",    label: "Hamısı" },
  { value: "active", label: "Aktiv" },
  { value: "funded", label: "Tamamlandı" },
];

export default function PatientFilter({ patients }: { patients: Patient[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchStatus = status === "all" || p.status === status;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q) ||
        (p.hospitalName?.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  }, [patients, search, status]);

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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
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
            onClick={() => { setSearch(""); setStatus("all"); }}
            className="mt-3 text-blue-600 text-sm hover:underline"
          >
            Filteri sıfırla
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}
    </div>
  );
}
