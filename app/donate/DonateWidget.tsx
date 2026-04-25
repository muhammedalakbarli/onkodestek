"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PRESETS = [5, 10, 20, 50, 100];

/* ── Ana widget ────────────────────────────────────────────────────────────── */
export default function DonateWidget() {
  const [preset, setPreset]   = useState<number | null>(null);
  const [custom, setCustom]   = useState("");
  const [step, setStep]       = useState<"amount" | "pay">("amount");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const amount = preset ?? (custom !== "" ? parseFloat(custom) : null);
  const hasAmount = amount !== null && !isNaN(amount) && amount >= 1;

  async function initPayment() {
    if (!hasAmount) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount * 100) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xəta baş verdi");
      setClientSecret(data.clientSecret);
      setStep("pay");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Addım indikatoru */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        {(["amount", "pay"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-slate-200" />}
            <div className={`flex items-center gap-1.5 text-xs font-medium ${
              step === s ? "text-teal-600" :
              step === "pay" && s === "amount" ? "text-emerald-500" : "text-slate-400"
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === s ? "bg-teal-600 text-white" :
                step === "pay" && s === "amount" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
              }`}>
                {step === "pay" && s === "amount" ? "✓" : i + 1}
              </div>
              <span className="hidden sm:inline">
                {s === "amount" ? "Məbləğ" : "Ödəniş"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6">
        {/* ── Addım 1: Məbləğ seç ──────────────────────────────────────────── */}
        {step === "amount" && (
          <div className="space-y-5">
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

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              onClick={initPayment}
              disabled={!hasAmount || loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Hazırlanır...
                </>
              ) : hasAmount ? (
                `${amount} ₼ ödəniş et →`
              ) : (
                "Məbləğ seçin"
              )}
            </button>

            {/* Dəstəklənən kartlar */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="text-xs text-slate-400">Qəbul edilən kartlar:</span>
              {["VISA", "MC", "Maestro"].map((c) => (
                <span key={c} className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Addım 2: Kart məlumatları ────────────────────────────────────── */}
        {step === "pay" && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#0d9488",
                  colorBackground: "#ffffff",
                  colorText: "#1e293b",
                  colorDanger: "#ef4444",
                  fontFamily: "-apple-system, sans-serif",
                  borderRadius: "12px",
                },
              },
              locale: "auto",
            }}
          >
            <PaymentForm
              amount={amount!}
              onBack={() => { setStep("amount"); setClientSecret(null); }}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

/* ── Stripe ödəniş forması ─────────────────────────────────────────────────── */
function PaymentForm({ amount, onBack }: { amount: number; onBack: () => void }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [status, setStatus]     = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg]     = useState<string | null>(null);
  const [name, setName]         = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [note, setNote]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStatus("loading");
    setErrMsg(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) { setErrMsg(submitErr.message ?? "Xəta"); setStatus("error"); return; }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/donate?success=1" },
      redirect: "if_required",
    });

    if (error) {
      setErrMsg(error.message ?? "Ödəniş uğursuz oldu");
      setStatus("error");
      return;
    }

    // Ödəniş uğurlu — DB-yə qeyd et
    await fetch("/api/platform-donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorName:   anonymous ? null : (name.trim() || null),
        amount,
        isAnonymous: anonymous,
        note:        note.trim() || null,
      }),
    }).catch(() => {});

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Təşəkkür edirik! 💙</h2>
        <p className="text-slate-500 text-sm">
          {amount.toLocaleString("az-AZ")} ₼ bağışınız qəbul edildi.
          Platformanı dəstəklədiyiniz üçün minnətdarıq.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-teal-700 font-medium">Bağış məbləği</span>
        <span className="text-lg font-extrabold text-teal-700">{amount.toLocaleString("az-AZ")} ₼</span>
      </div>

      {/* Stripe kart forması */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Kart məlumatları</p>
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { name: "auto" } },
          }}
        />
      </div>

      {/* Donor məlumatları */}
      <div className="space-y-3 pt-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm text-slate-700">Anonim olaraq bağış et</span>
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

      {errMsg && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{errMsg}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
        >
          ← Geri
        </button>
        <button
          type="submit"
          disabled={!stripe || status === "loading"}
          className="flex-2 flex-grow bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Emal edilir...
            </>
          ) : (
            `${amount.toLocaleString("az-AZ")} ₼ ödə`
          )}
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Stripe ilə şifrələnmiş ödəniş. Kart məlumatlarınız heç vaxt bizim serverə getmir.
      </p>
    </form>
  );
}
