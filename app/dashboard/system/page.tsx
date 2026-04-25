"use client";

import { useState } from "react";

type Result = { ok?: boolean; done?: boolean; results?: string[]; info?: unknown; webhook_url?: string; error?: string };

function ActionCard({
  title,
  description,
  buttonLabel,
  endpoint,
  method = "GET",
}: {
  title: string;
  description: string;
  buttonLabel: string;
  endpoint: string;
  method?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(endpoint, { method });
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  const isOk = result && (result.ok || result.done);
  const isErr = result && result.error;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors"
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {loading ? "Gözləyin…" : buttonLabel}
      </button>

      {result && (
        <div className={`mt-4 rounded-xl p-4 text-sm font-mono whitespace-pre-wrap break-all ${
          isErr ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
        }`}>
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
}

export default function SystemPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Sistem parametrləri</h1>
        <p className="text-slate-500 text-sm mt-1">Birdəfəlik əməliyyatlar və konfiqurasiya</p>
      </div>

      <div className="space-y-4">
        <ActionCard
          title="Verilənlər bazası miqrasiyası"
          description="Yeni cədvəlləri və sütunları produksiya DB-yə əlavə edir. Təhlükəsizdir — IF NOT EXISTS istifadə olunur."
          buttonLabel="Miqrasiya et"
          endpoint="/api/admin/migrate"
        />

        <ActionCard
          title="Telegram webhook qeydiyyatı"
          description="Botu Vercel-ə bağlayır. Hər deployment-dan sonra yenidən çağırmaq lazım deyil — bir dəfə qeyd etmək kifayətdir."
          buttonLabel="Webhook qur"
          endpoint="/api/admin/setup-webhook"
        />

        <ActionCard
          title="Webhook statusu"
          description="Telegram-ın hazırkı webhook məlumatını göstərir — URL, son xəta, gözləyən mesaj sayı."
          buttonLabel="Statusu yoxla"
          endpoint="/api/admin/webhook-info"
        />
      </div>
    </div>
  );
}
