"use client";

import { useState } from "react";

interface Props {
  cardNumber: string;
  iban: string;
}

const PRESETS = [5, 10, 20, 50, 100];

export default function DonateWidget({ cardNumber, iban }: Props) {
  const [preset, setPreset]       = useState<number | null>(null);
  const [custom, setCustom]       = useState("");
  const [copied, setCopied]       = useState<string | null>(null);
  const [step, setStep]           = useState<"amount" | "pay" | "confirm" | "done">("amount");
  const [name, setName]           = useState("");
  const [note, setNote]           = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const amount = preset ?? (custom !== "" ? parseFloat(custom) : null);
  const hasAmount = amount !== null && !isNaN(amount) && amount > 0;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function submit() {
    if (!hasAmount) return;
    setSubmitting(true);
    try {
      await fetch("/api/platform-donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName:   anonymous ? null : (name.trim() || null),
          amount,
          isAnonymous: anonymous,
          note:        note.trim() || null,
        }),
      });
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "done") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Təşəkkür edirik! 💙</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Bağışınız qeydə alındı. Platformanı dəstəklədiyiniz üçün minnətdarıq.
        </p>
        <button
          onClick={() => { setStep("amount"); setPreset(null); setCustom(""); setName(""); setNote(""); setAnonymous(false); }}
          className="mt-6 text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          Yenidən bağış et
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Addım indikatoru */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        {(["amount", "pay", "confirm"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-6 h-px bg-slate-200" />}
            <div className={`flex items-center gap-1.5 text-xs font-medium ${
              step === s ? "text-teal-600" :
              (["amount", "pay", "confirm"].indexOf(step) > i ? "text-emerald-500" : "text-slate-400")
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === s ? "bg-teal-600 text-white" :
                (["amount", "pay", "confirm"].indexOf(step) > i ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")
              }`}>
                {["amount", "pay", "confirm"].indexOf(step) > i ? "✓" : i + 1}
              </div>
              <span className="hidden sm:inline">
                {s === "amount" ? "Məbləğ" : s === "pay" ? "Ödəniş" : "Bildiriş"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6">

        {/* ── Addım 1: Məbləğ seç ──────────────────────────────────────── */}
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
              <p className="text-sm font-semibold text-slate-700 mb-2">Və ya özünüz daxil edin</p>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setPreset(null); }}
                  placeholder="Məbləğ..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₼</span>
              </div>
            </div>
            <button
              onClick={() => setStep("pay")}
              disabled={!hasAmount}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {hasAmount ? `${amount} ₼ bağışla →` : "Məbləğ seçin"}
            </button>
          </div>
        )}

        {/* ── Addım 2: Bank məlumatları ────────────────────────────────── */}
        {step === "pay" && (
          <div className="space-y-5">
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-teal-700 font-medium">Bağış məbləği</span>
              <span className="text-lg font-extrabold text-teal-700">{amount} ₼</span>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Bank məlumatları</p>
              <CopyRow label="Bank" value="Kapital Bank" />
              <CopyRow label="Kart nömrəsi" value={cardNumber} onCopy={() => copy(cardNumber, "card")} copied={copied === "card"} />
              <CopyRow label="IBAN" value={iban} onCopy={() => copy(iban, "iban")} copied={copied === "iban"} />
              <CopyRow label="Alıcı" value="OnkoDəstək Platforması" />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
              Köçürməni tamamladıqdan sonra "Bağışladım" düyməsinə basın.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("amount")}
                className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                ← Geri
              </button>
              <button
                onClick={() => setStep("confirm")}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Bağışladım ✓
              </button>
            </div>
          </div>
        )}

        {/* ── Addım 3: Bildiriş formu ───────────────────────────────────── */}
        {step === "confirm" && (
          <div className="space-y-5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-emerald-700 font-medium">
                {amount} ₼ köçürülüb — Təşəkkür edirik!
              </span>
            </div>

            <p className="text-sm text-slate-600">
              Dəstəkçilər siyahısında görünmək istəyirsiniz? Adınızı qeyd edin (istəyə bağlı).
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-700">Anonim olaraq qeyd et</span>
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
                placeholder="Qısa mesaj (istəyə bağlı)"
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("pay")}
                className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                ← Geri
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                {submitting ? "Göndərilir..." : "Tamamla"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyRow({
  label, value, onCopy, copied,
}: {
  label: string; value: string; onCopy?: () => void; copied?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs font-medium text-slate-400 w-28 shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-mono text-slate-800 truncate">{value}</span>
        {onCopy && (
          <button
            onClick={onCopy}
            className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-all ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-700"
            }`}
          >
            {copied ? "✓ Kopyalandı" : "Kopyala"}
          </button>
        )}
      </div>
    </div>
  );
}
