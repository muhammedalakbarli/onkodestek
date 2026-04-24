"use client";

import { useState } from "react";
import Link from "next/link";

const AREAS = [
  { value: "tibbi",      label: "Tibbi dəstək",     desc: "Tibb işçisi, həkim, tibb bacısı",      icon: "M4.5 12.75l6 6 9-13.5" },
  { value: "hüquqi",     label: "Hüquqi yardım",    desc: "Hüquqşünas, vəkil",                   icon: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 4.97z" },
  { value: "texniki",    label: "Texniki dəstək",   desc: "Proqramçı, dizayner, IT mütəxəssisi",  icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" },
  { value: "media",      label: "Media / PR",       desc: "Jurnalist, SMM, foto/video",           icon: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" },
  { value: "psixoloji",  label: "Psixoloji dəstək", desc: "Psixoloq, sosial işçi",                icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
  { value: "digər",      label: "Digər",            desc: "Başqa bir sahədə kömək",               icon: "M12 4.5v15m7.5-7.5h-15" },
];

export default function VolunteerForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    area: "",
    message: "",
    _trap: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.area) { setErrorMsg("Zəhmət olmasa bir sahə seçin."); return; }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error ?? "Xəta baş verdi.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Şəbəkə xətası. Yenidən cəhd edin.");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm mx-auto mt-12">
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Müraciətiniz alındı!</h2>
        <p className="text-sm text-slate-500 mb-6">
          Komandamız ən qısa zamanda sizinlə əlaqə saxlayacaq. Dəstəyiniz üçün təşəkkür edirik.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors"
        >
          Ana səhifəyə qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* Sahə seçimi */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-800 mb-1">Hansı sahədə kömək edə bilərsiniz?</h2>
        <p className="text-sm text-slate-500 mb-4">Bir sahə seçin</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AREAS.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, area: a.value }))}
              className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all ${
                form.area === a.value
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                form.area === a.value ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                </svg>
              </div>
              <div>
                <p className={`text-sm font-semibold ${form.area === a.value ? "text-teal-700" : "text-slate-800"}`}>
                  {a.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-800">Əlaqə məlumatları</h2>

        <input type="text" name="_trap" value={form._trap} onChange={(e) => setForm(f => ({ ...f, _trap: e.target.value }))} className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ad Soyad <span className="text-red-500">*</span></label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="Adınız Soyadınız"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-poçt <span className="text-red-500">*</span></label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="email@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Telefon</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+994 XX XXX XX XX"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mesaj</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder="Özünüz, təcrübəniz və necə kömək edə biləcəyiniz haqqında qısaca yazın..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400 resize-none"
          />
        </div>

        {errorMsg && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !form.area}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {status === "loading" ? "Göndərilir..." : "Müraciət göndər"}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Məlumatlarınız yalnız könüllülük məqsədi ilə istifadə edilir.
        </p>
      </form>
    </div>
  );
}
