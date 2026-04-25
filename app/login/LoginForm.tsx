"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    if (!agreed || loading) return;
    setLoading(true);
    await signIn("google", { callbackUrl: callbackUrl ?? "/patients" });
  }

  return (
    <div className="space-y-4">
      {/* Şərtlər checkbox */}
      <label className="flex items-start gap-3 cursor-pointer select-none group">
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            agreed
              ? "bg-teal-600 border-teal-600"
              : "bg-white border-slate-300 group-hover:border-teal-400"
          }`}>
            {agreed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm text-slate-600 leading-snug">
          <Link href="/privacy" className="text-teal-600 hover:underline font-medium">Məxfilik Siyasəti</Link>
          {" "}və{" "}
          <Link href="/terms" className="text-teal-600 hover:underline font-medium">İstifadə Şərtlərini</Link>
          {" "}oxudum, qəbul edirəm.
        </span>
      </label>

      {/* Google düyməsi */}
      <button
        onClick={handleGoogle}
        disabled={!agreed || loading}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-slate-800 font-semibold py-3.5 px-5 rounded-xl transition-all text-sm shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white disabled:shadow-none"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Google ilə daxil ol
      </button>
    </div>
  );
}
