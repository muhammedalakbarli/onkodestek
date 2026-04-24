"use client";

import { useState } from "react";

interface Props {
  patientName: string;
  trackId?: string | null;
}

export default function DonationModal({ patientName, trackId }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"iban" | "ref" | null>(null);

  const iban = process.env.NEXT_PUBLIC_DONATION_IBAN ?? "";
  const bank = process.env.NEXT_PUBLIC_DONATION_BANK ?? "Azərbaycan Beynəlxalq Bankı";
  const reference = trackId ? `${trackId} - ${patientName}` : patientName;

  function copy(text: string, field: "iban" | "ref") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        Dəstək ol
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Başlıq */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-1">Bank köçürməsi</p>
                  <h2 className="text-lg font-bold">{patientName} üçün dəstək</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">

              {/* Xəbərdarlıq */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Köçürmə <b>təyinatına</b> mütləq izləmə kodunu yazın. Bu olmadan ianəniz xəstəyə aid edilə bilməz.
                </p>
              </div>

              {/* Bank */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <Row label="Bank" value={bank} />

                {/* IBAN */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">IBAN</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 tracking-wider">
                      {iban}
                    </code>
                    <button
                      onClick={() => copy(iban, "iban")}
                      className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        copied === "iban"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {copied === "iban" ? "✓ Kopyalandı" : "Kopyala"}
                    </button>
                  </div>
                </div>

                {/* Təyinat */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Təyinat (mütləq yazın)</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2">
                      {reference}
                    </code>
                    <button
                      onClick={() => copy(reference, "ref")}
                      className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        copied === "ref"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {copied === "ref" ? "✓ Kopyalandı" : "Kopyala"}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Köçürməniz 1–2 iş günü ərzində qeydə alınacaq və saytda əks olunacaq.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
