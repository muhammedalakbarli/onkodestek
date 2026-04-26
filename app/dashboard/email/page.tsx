"use client";

import { useState } from "react";

type Audience = "all" | "donors";
type State = "idle" | "sending" | "done" | "error";

export default function BulkEmailPage() {
  const [subject, setSubject]   = useState("");
  const [body, setBody]         = useState("");
  const [audience, setAudience] = useState<Audience>("donors");
  const [state, setState]       = useState<State>("idle");
  const [result, setResult]     = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [errMsg, setErrMsg]     = useState("");

  async function send() {
    if (!subject.trim() || !body.trim()) return;
    setState("sending");
    setResult(null);
    setErrMsg("");

    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, audience }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error ?? "Xəta baş verdi");
        setState("error");
        return;
      }
      setResult(data);
      setState("done");
    } catch {
      setErrMsg("Şəbəkə xətası");
      setState("error");
    }
  }

  function reset() {
    setSubject("");
    setBody("");
    setState("idle");
    setResult(null);
    setErrMsg("");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Toplu E-poçt</h1>
        <p className="text-slate-500 text-sm mt-1">Bütün istifadəçilərə və ya ianəçilərə e-poçt göndərin</p>
      </div>

      {state === "done" && result ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-bold text-emerald-800 mb-1">Göndərildi!</p>
          <p className="text-sm text-emerald-700">
            {result.sent} e-poçt göndərildi
            {result.failed > 0 && `, ${result.failed} uğursuz`}
            {" "}({result.total} alıcı)
          </p>
          <button
            onClick={reset}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            Yeni e-poçt
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          {/* Audience */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Alıcı qrupu</label>
            <div className="flex gap-3">
              {(["donors", "all"] as Audience[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    audience === a
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {a === "donors" ? "Yalnız ianəçilər" : "Bütün istifadəçilər"}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subj" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Mövzu
            </label>
            <input
              id="subj"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E-poçtun başlığı"
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Mətn
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="E-poçt məzmunu..."
              rows={10}
              maxLength={10000}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{body.length} / 10000</p>
          </div>

          {errMsg && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{errMsg}</p>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-amber-700">
              Bu e-poçt seçilən qrupdakı <strong>bütün</strong> istifadəçilərə göndəriləcək. Mətni göndərməzdən əvvəl yoxlayın.
            </p>
          </div>

          <button
            onClick={send}
            disabled={state === "sending" || !subject.trim() || !body.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {state === "sending" ? "Göndərilir…" : "Göndər"}
          </button>
        </div>
      )}
    </div>
  );
}
