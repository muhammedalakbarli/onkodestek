"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";

type PlatformDonation = {
  id: number;
  donorName: string | null;
  amount: string;
  isAnonymous: boolean;
  note: string | null;
  createdAt: string;
};

export default function PlatformDonationsPage() {
  const [list, setList] = useState<PlatformDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ donorName: "", amount: "", isAnonymous: false, note: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-donations");
    if (res.ok) setList(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/platform-donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorName:   form.isAnonymous ? null : (form.donorName || null),
        amount:      form.amount,
        isAnonymous: form.isAnonymous,
        note:        form.note || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      setForm({ donorName: "", amount: "", isAnonymous: false, note: "" });
      load();
    }
  }

  const total = list.reduce((s, d) => s + parseFloat(d.amount), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Platform ianələri</h1>
          <p className="text-slate-500 text-sm mt-1">
            Cəmi {list.length} ianəçi — {total.toLocaleString("az-AZ")} ₼
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          İanə əlavə et
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm mb-6 space-y-4">
          <h2 className="font-semibold text-slate-800 text-sm">Yeni platform ianəsi</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">İanəçi adı</label>
              <input
                value={form.donorName}
                onChange={(e) => setForm(f => ({ ...f, donorName: e.target.value }))}
                disabled={form.isAnonymous}
                placeholder="Ad Soyad"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Məbləğ (₼) <span className="text-red-500">*</span></label>
              <input
                required
                value={form.amount}
                onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="50.00"
                pattern="^\d+(\.\d{1,2})?$"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Qeyd</label>
            <input
              value={form.note}
              onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Könüllü şərh..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAnonymous}
              onChange={(e) => setForm(f => ({ ...f, isAnonymous: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-600"
            />
            <span className="text-sm text-slate-600">Anonim göstər</span>
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saxlanır..." : "Saxla"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-slate-100 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Ləğv et
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">Yüklənir...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">Hələlik platform ianəsi yoxdur.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-50">
            {list.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                    {d.isAnonymous ? "?" : (d.donorName?.[0]?.toUpperCase() ?? "?")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {d.isAnonymous ? "Anonim dəstəkçi" : (d.donorName ?? "Naməlum")}
                    </p>
                    {d.note && <p className="text-xs text-slate-400">"{d.note}"</p>}
                    <p className="text-xs text-slate-400">{formatDate(new Date(d.createdAt))}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-600">
                  +{parseFloat(d.amount).toLocaleString("az-AZ")} ₼
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
