"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccount() {
  const [open, setOpen]       = useState(false);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleDelete() {
    if (confirm !== "SİL") return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/me", { method: "DELETE" });
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
    } else {
      setError("Xəta baş verdi. Yenidən cəhd edin.");
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Hesabı sil</h2>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Şəxsi məlumatlarınız (ad, e-poçt, profil şəkli) silinəcək. İanə tarixçəniz maliyyə
              şəffaflığı üçün anonim olaraq saxlanılacaq.
            </p>
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Təsdiqləmək üçün <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">SİL</span> yazın:
            </p>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="SİL"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setOpen(false); setConfirm(""); setError(""); }}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirm !== "SİL" || loading}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Silinir..." : "Hesabı sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors mt-3"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Hesabı sil
      </button>
    </>
  );
}
