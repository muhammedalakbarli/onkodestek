"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/utils";

type Update = {
  id: number;
  content: string;
  photoUrl: string | null;
  createdAt: string;
};

export default function PatientUpdateForm({ patientId }: { patientId: number }) {
  const [updates, setUpdates]   = useState<Update[]>([]);
  const [content, setContent]   = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/patient-updates?patientId=${patientId}`);
    if (res.ok) setUpdates(await res.json());
  }, [patientId]);

  useEffect(() => { load(); }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/patient-updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, content: content.trim(), photoUrl: photoUrl.trim() }),
    });
    if (res.ok) {
      setContent("");
      setPhotoUrl("");
      await load();
    } else {
      setError("Xəta baş verdi.");
    }
    setSaving(false);
  }

  async function remove(id: number) {
    if (!confirm("Bu xəbəri silmək istəyirsiniz?")) return;
    await fetch(`/api/patient-updates?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-4">
      <div className="px-5 py-4 border-b border-slate-50">
        <h2 className="font-bold text-slate-900 text-sm">Xəstə yenilikləri</h2>
        <p className="text-xs text-slate-400 mt-0.5">İctimai xəstə səhifəsində görünəcək</p>
      </div>

      {/* Yeni yenilik */}
      <form onSubmit={submit} className="p-5 border-b border-slate-50 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Müalicə yeniliyi, vəziyyət məlumatı..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <input
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="Şəkil URL (istəyə görə)"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving || !content.trim()}
          className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Əlavə edilir..." : "Yenilik əlavə et"}
        </button>
      </form>

      {/* Siyahı */}
      <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
        {updates.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400 text-center">Hələlik yenilik yoxdur.</p>
        ) : updates.map((u) => (
          <div key={u.id} className="px-5 py-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 leading-relaxed">{u.content}</p>
              {u.photoUrl && (
                <a href={u.photoUrl} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-blue-500 hover:text-blue-700 mt-0.5 inline-block">
                  Şəkilə bax →
                </a>
              )}
              <p className="text-xs text-slate-400 mt-1">{formatDate(u.createdAt)}</p>
            </div>
            <button
              onClick={() => remove(u.id)}
              className="text-slate-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
              title="Sil"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
