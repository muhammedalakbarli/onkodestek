"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function AdminLoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const urlError     = searchParams.get("error");

  const [password, setPassword]         = useState("");
  const [error, setError]               = useState(
    urlError === "invalid" ? "Magic link etibarsız və ya vaxtı keçib. Yenidən cəhd edin." :
    urlError === "missing" ? "Link tam deyil. Zəhmət olmasa yenidən göndərin." : ""
  );
  const [loading, setLoading]           = useState(false);
  const [magicSent, setMagicSent]       = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      localStorage.setItem("admin_secret", password);
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Şifrə yanlışdır");
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    setMagicLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/send-magic", { method: "POST" });
      if (res.ok) {
        setMagicSent(true);
      } else {
        const d = await res.json();
        setError(d.error ?? "Göndərilmədi. Telegram konfiqurasiyasını yoxlayın.");
      }
    } catch {
      setError("Şəbəkə xətası baş verdi.");
    } finally {
      setMagicLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur">
              <Image src="/logo.jpeg" alt="OnkoDəstək" width={44} height={44} className="rounded-xl object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">OnkoDəstək</h1>
          <p className="text-slate-400 text-sm mt-1">Admin paneli</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">

          {/* Xəta mesajı */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Telegram magic link */}
          {magicSent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-4 text-center">
              <svg className="w-8 h-8 text-emerald-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <p className="text-emerald-400 font-semibold text-sm">Link Telegram-a göndərildi!</p>
              <p className="text-slate-400 text-xs mt-1">Telegramı açın və linki tıklayın. 10 dəqiqə etibarlıdır.</p>
            </div>
          ) : (
            <button
              onClick={handleMagicLink}
              disabled={magicLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 disabled:opacity-60 text-blue-300 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {magicLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8c-.12.58-.45.72-.91.45l-2.52-1.86-1.21 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1l-5.74 3.62-2.47-.77c-.54-.17-.55-.54.11-.8l9.64-3.72c.45-.16.84.11.69.53z"/>
                </svg>
              )}
              Telegram ilə daxil ol
            </button>
          )}

          {/* Separator */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">və ya şifrə ilə</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Şifrə formu */}
          <form onSubmit={handlePassword} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin şifrəsi"
              required
              className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? "Daxil olunur..." : "Daxil ol"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Yalnız səlahiyyətli şəxslər üçün
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
