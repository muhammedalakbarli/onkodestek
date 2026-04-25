"use client";

import { useState, useEffect } from "react";

const PRESETS = [5, 10, 20, 50, 100];

export default function DonateWidget() {
  const [preset, setPreset]       = useState<number | null>(null);
  const [custom, setCustom]       = useState("");
  const [name, setName]           = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [note, setNote]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [pageStatus, setPageStatus] = useState<"idle" | "success" | "cancelled">("idle");

  const amount = preset ?? (custom !== "" ? parseFloat(custom) : null);
  const hasAmount = amount !== null && !isNaN(amount) && amount >= 1;

  // PayRiff-dən qayıdanda URL parametrlərinə bax
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setPageStatus("success");
      window.history.replaceState({}, "", "/donate");
    } else if (params.get("cancelled") === "1" || params.get("declined") === "1") {
      setPageStatus("cancelled");
      window.history.replaceState({}, "", "/donate");
    }
  }, []);

  async function handlePay() {
    if (!hasAmount) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payriff/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          amount,
          donorName:   anonymous ? null : (name.trim() || null),
          isAnonymous: anonymous,
          note:        note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xəta baş verdi");
      window.location.href = data.paymentUrl;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Xəta baş verdi");
      setLoading(false);
    }
  }

  if (pageStatus === "success") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Təşəkkür edirik! 💙</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Bağışınız qəbul edildi. Platformanı dəstəklədiyiniz üçün minnətdarıq.
        </p>
        <button
          onClick={() => setPageStatus("idle")}
          className="mt-5 text-sm text-teal-600 hover:underline"
        >
          Yenidən ianə et
        </button>
      </div>
    );
  }

  if (pageStatus === "cancelled") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-700 mb-2">Ödəniş ləğv edildi</h2>
        <p className="text-slate-400 text-sm">Ödəniş tamamlanmadı. İstəsəniz yenidən cəhd edə bilərsiniz.</p>
        <button
          onClick={() => setPageStatus("idle")}
          className="mt-5 text-sm text-teal-600 hover:underline"
        >
          Yenidən cəhd et
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Platformaya ianə et</h3>
        <p className="text-xs text-slate-400 mt-0.5">Kapital Bank, ABB, UniBank və digər kartlar qəbul edilir</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Məbləğ seç */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Məbləğ seçin</p>
          <div className="grid grid-cols-5 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => { setPreset(p); setCustom(""); }}
                className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                  preset === p
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                {p}₼
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Özünüz daxil edin</p>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setPreset(null); }}
              placeholder="Məbləğ..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₼</span>
          </div>
        </div>

        {/* Donor məlumatları */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-slate-700">Anonim olaraq ianə et</span>
          </label>
          {!anonymous && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız (istəyə bağlı)"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          )}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Mesajınız (istəyə bağlı)"
            rows={2}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          onClick={handlePay}
          disabled={!hasAmount || loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Ödəniş səhifəsinə yönləndirilir...
            </>
          ) : hasAmount ? (
            `${amount} ₼ ödəniş et →`
          ) : (
            "Məbləğ seçin"
          )}
        </button>

        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="text-xs text-slate-400">Qəbul edilən kartlar:</span>
          {["VISA", "MasterCard", "Maestro"].map((c) => (
            <span key={c} className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{c}</span>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          PayRiff ilə təhlükəsiz ödəniş
        </p>
      </div>
    </div>
  );
}
