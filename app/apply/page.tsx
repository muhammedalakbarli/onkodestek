"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Step = "step1" | "step2" | "success";

interface FormData {
  fullName: string;
  age: string;
  diagnosis: string;
  hospitalName: string;
  contactPhone: string;
  story: string;
  goalAmount: string;
  applicantName: string; // müraciət edən şəxs (ailə üzvü ola bilər)
  relation: string;      // xəstə ilə münasibət
}

const RELATIONS = [
  "Özüm xəstəyəm",
  "Həyat yoldaşı",
  "Valideyn",
  "Övlad",
  "Qardaş/Bacı",
  "Digər qohum",
];

export default function ApplyPage() {
  const [step, setStep] = useState<Step>("step1");
  const [loading, setLoading] = useState(false);
  const [trackId, setTrackId] = useState("");
  const [error, setError] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const docRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    age: "",
    diagnosis: "",
    hospitalName: "",
    contactPhone: "",
    story: "",
    goalAmount: "",
    applicantName: "",
    relation: RELATIONS[0],
  });

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function submit() {
    setLoading(true);
    setError("");
    try {
      let documentUrl: string | undefined;

      if (docFile) {
        const fd = new FormData();
        fd.append("file", docFile);
        const upRes = await fetch("/api/upload/apply", { method: "POST", body: fd });
        if (!upRes.ok) {
          const e = await upRes.json().catch(() => ({}));
          throw new Error(e.error ?? "Fayl yükləmə xətası");
        }
        const { url } = await upRes.json();
        documentUrl = url as string;
      }

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _trap: "", documentUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Xəta baş verdi");
      setTrackId(data.trackId);
      setStep("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Müraciətiniz qəbul edildi!</h1>
          <p className="text-sm text-slate-500 mb-6">
            Komandamız sənədlərinizi yoxladıqdan sonra sizinlə əlaqə saxlayacaq. Adətən <strong>1–3 iş günü</strong> ərzində cavab verilir.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-400 font-medium mb-1">İzləmə kodunuz</p>
            <p className="text-2xl font-bold font-mono text-slate-900 tracking-wider">{trackId}</p>
            <p className="text-xs text-slate-400 mt-1">Bu kodu saxlayın — müraciətin statusunu izləmək üçün lazımdır</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={`/track?id=${trackId}`}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Müraciəti izlə
            </Link>
            <Link
              href="/"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Ana səhifəyə qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Başlıq + addım göstəricisi */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-slate-900">Yardım müraciəti</h1>
            <span className="text-xs text-slate-400 font-medium">Addım {step === "step1" ? 1 : 2} / 2</span>
          </div>
          <div className="flex gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-teal-600" />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step === "step2" ? "bg-teal-600" : "bg-slate-200"}`} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {step === "step1" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-4">Müraciət edən şəxs</h2>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <Field
                  label="Adınız, soyadınız"
                  placeholder="Əli Əliyev"
                  value={form.applicantName}
                  onChange={set("applicantName")}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Xəstə ilə münasibətiniz
                  </label>
                  <select
                    value={form.relation}
                    onChange={set("relation")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800"
                  >
                    {RELATIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <Field
                  label="Əlaqə nömrəsi"
                  placeholder="+994501234567"
                  value={form.contactPhone}
                  onChange={set("contactPhone")}
                  type="tel"
                />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 mb-4">Xəstə haqqında</h2>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <Field
                  label="Xəstənin tam adı"
                  placeholder="Adı Soyadı"
                  value={form.fullName}
                  onChange={set("fullName")}
                />
                <Field
                  label="Yaşı"
                  placeholder="45"
                  value={form.age}
                  onChange={set("age")}
                  type="number"
                />
                <Field
                  label="Diaqnoz"
                  placeholder="Məs: Mədə xərçəngi, III mərhələ"
                  value={form.diagnosis}
                  onChange={set("diagnosis")}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!form.applicantName || !form.fullName || !form.diagnosis || !form.contactPhone) {
                  setError("Zəhmət olmasa bütün məcburi sahələri doldurun");
                  return;
                }
                setError("");
                setStep("step2");
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
            >
              Növbəti addım →
            </button>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </div>
        )}

        {step === "step2" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-4">Müalicə məlumatları</h2>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <Field
                  label="Xəstəxana adı"
                  placeholder="Məs: AMEA Onkologiya Mərkəzi"
                  value={form.hospitalName}
                  onChange={set("hospitalName")}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Xəstənin hekayəsi
                    <span className="text-slate-400 font-normal ml-1">(saytda göstəriləcək)</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Xəstənin vəziyyətini, müalicə prosesini qısaca izah edin..."
                    value={form.story}
                    onChange={set("story")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Lazım olan məbləğ (₼)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="5000"
                      value={form.goalAmount}
                      onChange={set("goalAmount")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400 pr-10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₼</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sənəd yüklə */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tibbi sənəd yüklə
                <span className="text-slate-400 font-normal ml-1">(xəstəxana arayışı, şəkil — istəğə bağlı)</span>
              </label>
              <p className="text-xs text-slate-400 mb-3">JPG, PNG, PDF · Maks 5 MB</p>
              <input
                ref={docRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100 cursor-pointer"
              />
              {docFile && (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {docFile.name}
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Müraciətiniz komandamız tərəfindən yoxlanılacaq. Tibbi sənədlər (şəxsiyyət vəsiqəsi, xəstəxana arayışı) tələb oluna bilər.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setError(""); setStep("step1"); }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl text-sm transition-colors"
              >
                ← Geri
              </button>
              <button
                onClick={() => {
                  if (!form.goalAmount || parseFloat(form.goalAmount) <= 0) {
                    setError("Zəhmət olmasa lazım olan məbləği daxil edin");
                    return;
                  }
                  setError("");
                  submit();
                }}
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
              >
                {loading ? "Göndərilir..." : "Müraciəti göndər"}
              </button>
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label, placeholder, value, onChange, type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400"
      />
    </div>
  );
}
