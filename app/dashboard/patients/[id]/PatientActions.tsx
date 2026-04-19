"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Patient } from "@/drizzle/schema";

const STATUS_OPTIONS = [
  { value: "pending",  label: "Yoxlanılır" },
  { value: "verified", label: "Yoxlanıldı" },
  { value: "active",   label: "Aktiv" },
  { value: "funded",   label: "Tamamlandı" },
  { value: "closed",   label: "Bağlandı" },
];

const EXPENSE_CATEGORIES = [
  { value: "medication",   label: "Dərman" },
  { value: "treatment",    label: "Müalicə" },
  { value: "consultation", label: "Konsultasiya" },
  { value: "transport",    label: "Nəqliyyat" },
  { value: "other",        label: "Digər" },
];

type Tab = "status" | "expense" | "donation";

export default function PatientActions({ patient }: { patient: Patient }) {
  const router  = useRouter();
  const [tab, setTab]         = useState<Tab>("status");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Status formu
  const [status,   setStatus]   = useState(patient.status);
  const [isPublic, setIsPublic] = useState(patient.isPublic);

  // Xərc formu
  const [expAmount,   setExpAmount]   = useState("");
  const [expCategory, setExpCategory] = useState("medication");
  const [expDesc,     setExpDesc]     = useState("");
  const [expReceipt,  setExpReceipt]  = useState("");

  // İanə formu
  const [donAmount,   setDonAmount]   = useState("");
  const [donName,     setDonName]     = useState("");
  const [donAnon,     setDonAnon]     = useState(false);

  function flash(type: "ok" | "err", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  async function saveStatus() {
    setLoading(true);
    const res = await fetch(`/api/patients/${patient.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": getAdminSecret(),
      },
      body: JSON.stringify({ status, isPublic }),
    });
    setLoading(false);
    if (res.ok) {
      flash("ok", "Status yeniləndi");
      router.refresh();
    } else {
      flash("err", "Xəta baş verdi");
    }
  }

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!expAmount) return;
    setLoading(true);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": getAdminSecret(),
      },
      body: JSON.stringify({
        patientId:   patient.id,
        type:        "expense",
        amount:      parseFloat(expAmount),
        category:    expCategory,
        description: expDesc || null,
        receiptUrl:  expReceipt || null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      flash("ok", "Xərc əlavə edildi");
      setExpAmount(""); setExpDesc(""); setExpReceipt("");
      router.refresh();
    } else {
      flash("err", "Xəta baş verdi");
    }
  }

  async function addDonation(e: React.FormEvent) {
    e.preventDefault();
    if (!donAmount) return;
    setLoading(true);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": getAdminSecret(),
      },
      body: JSON.stringify({
        patientId:   patient.id,
        type:        "donation",
        amount:      parseFloat(donAmount),
        donorName:   donAnon ? null : (donName || null),
        isAnonymous: donAnon,
      }),
    });
    setLoading(false);
    if (res.ok) {
      flash("ok", "İanə qeyd edildi");
      setDonAmount(""); setDonName(""); setDonAnon(false);
      router.refresh();
    } else {
      flash("err", "Xəta baş verdi");
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Tab başlıqları */}
      <div className="flex border-b border-slate-100">
        {([
          { key: "status",   label: "Status" },
          { key: "expense",  label: "Xərc" },
          { key: "donation", label: "İanə" },
        ] as { key: Tab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* Flash mesajı */}
        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
            msg.type === "ok"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {msg.type === "ok" ? "✓ " : "✗ "}{msg.text}
          </div>
        )}

        {/* ── Status tab ─────────────────────────────────── */}
        {tab === "status" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Müraciət statusu</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPublic(!isPublic)}
                className={`w-11 h-6 rounded-full transition-colors relative ${isPublic ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPublic ? "translate-x-5.5 left-0.5" : "left-0.5"}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {isPublic ? "Saytda görünür" : "Gizlidir (yalnız admin)"}
              </span>
            </label>

            <button
              onClick={saveStatus}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {loading ? "Saxlanılır..." : "Yadda saxla"}
            </button>
          </div>
        )}

        {/* ── Xərc tab ───────────────────────────────────── */}
        {tab === "expense" && (
          <form onSubmit={addExpense} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Məbləğ (AZN)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kateqoriya</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Təsvir</label>
              <input
                type="text"
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="məs: Taxol 30mg — 2 kurs"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Qəbz URL-i (istəğə bağlı)</label>
              <input
                type="url"
                value={expReceipt}
                onChange={(e) => setExpReceipt(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {loading ? "Əlavə edilir..." : "Xərci qeyd et"}
            </button>
          </form>
        )}

        {/* ── İanə tab ───────────────────────────────────── */}
        {tab === "donation" && (
          <form onSubmit={addDonation} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Məbləğ (AZN)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={donAmount}
                onChange={(e) => setDonAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={donAnon}
                onChange={(e) => setDonAnon(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm text-slate-600">Anonim ianə</span>
            </label>

            {!donAnon && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">İanəçinin adı</label>
                <input
                  type="text"
                  value={donName}
                  onChange={(e) => setDonName(e.target.value)}
                  placeholder="Ad Soyad"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {loading ? "Qeyd edilir..." : "İanəni qeyd et"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// Cookie-dən admin secreti oxumaq əvəzinə localStorage istifadə edirik
// (cookie httpOnly olduğu üçün JS-dən oxunmur; session storage-də saxlayırıq)
function getAdminSecret(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_secret") ?? "";
}
