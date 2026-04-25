import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Search, ShieldCheck, Heart, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Haqqımızda",
  description: "OnkoDəstək — Azərbaycanda onkoloji xəstəliklərə qarşı şəffaf xeyriyyəçilik platforması. Missiyamız, dəyərlərimiz və komandamız haqqında.",
};

const VALUES = [
  {
    Icon: ShieldCheck,
    color: "text-teal-600",
    bg: "bg-teal-50 border-teal-100",
    title: "Şəffaflıq",
    desc: "Toplanmış hər qəpik açıq şəkildə hesabat verilir. Heç bir xərc qəbzsiz edilmir.",
  },
  {
    Icon: Search,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100",
    title: "Etibarlılıq",
    desc: "Hər müraciət sənəd yoxlamasından keçir. Yalnız təsdiqlənmiş xəstələr ictimaiyyətə açılır.",
  },
  {
    Icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-100",
    title: "İnsanlıq",
    desc: "Biz yardımı rəqəmsallaşdırırıq, amma insanı mərkəzdə saxlayırıq.",
  },
  {
    Icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
    title: "Sürət",
    desc: "Müraciətlər 1–3 iş günü ərzində yoxlanılır. Vəsait birbaşa xəstəyə çatır.",
  },
];

const STEPS = [
  { num: "01", title: "Müraciət",    desc: "Xəstə ailəsi sayt forması vasitəsilə müraciət edir, tibbi sənədlər yüklənir.", color: "from-blue-500 to-teal-500" },
  { num: "02", title: "Yoxlama",     desc: "Komandamız tibbi sənədləri, xəstəxana arayışını və ehtiyacı yoxlayır.", color: "from-teal-500 to-emerald-500" },
  { num: "03", title: "Yayım",       desc: "Yoxlanılmış xəstənin kampaniyası saytda ictimaiyyətə açılır.", color: "from-emerald-500 to-teal-500" },
  { num: "04", title: "Yığım",       desc: "İanəçilər kampaniyaya dəstək verir. Hər ianə qeydə alınır.", color: "from-teal-500 to-blue-500" },
  { num: "05", title: "Xərclənmə",   desc: "Vəsait xəstəxanaya / əczaçılığa birbaşa köçürülür.", color: "from-blue-500 to-violet-500" },
  { num: "06", title: "Hesabat",     desc: "Hər xərc rəsmi qəbzlə saytda dərc edilir. Heç nə silinmir.", color: "from-violet-500 to-teal-500" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-teal-800 to-blue-900 text-white">
        <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <Image src="/logo.jpeg" alt="OnkoDəstək" width={44} height={44} className="rounded-xl object-contain" />
            </div>
          </div>
          <p className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-4">Haqqımızda</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Hər ianənin arxasında<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-200">
              şəffaf bir sistem var
            </span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
            OnkoDəstək — Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə maddi
            və psixoloji dəstək göstərən rəqəmsal xeyriyyəçilik platformasıdır.
          </p>
        </div>
      </section>

      {/* ── Missiya ──────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">Missiyamız</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-5">Yardımı şəffaf edin</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Azərbaycanda xeyriyyəçilik çox vaxt qeyri-şəffaf şəkildə aparılır. Vəsaitin hara
              xərcləndiyini bilmək çətindir, bu da insanların yardım etməkdən çəkinməsinə səbəb olur.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Biz bu problemi həll etmək üçün <strong>hər ianəni</strong> və <strong>hər xərci</strong> real
              vaxtda açıqlayan bir platforma qurduq. İanəçi pulu hara getdiyini özü görür.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {VALUES.map((v) => (
              <div key={v.title} className={`bg-white border ${v.bg} rounded-2xl p-5 border`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${v.bg} ${v.color}`}>
                  <v.Icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Necə işləyir ─────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-2">Proses</p>
            <h2 className="text-3xl font-bold text-slate-900">Müraciətdən xərclənməyə</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div key={s.num} className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
                <span className="text-5xl font-black text-slate-100 absolute top-4 right-5 select-none leading-none">{s.num}</span>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-800 via-teal-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image src="/logo.jpeg" alt="onkodəstək" width={48} height={48} className="rounded-2xl object-contain opacity-90" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Siz də dəstək ola bilərsiniz</h2>
          <p className="text-blue-200 mb-8">Yardıma ehtiyacı olan xəstə varsa müraciət edin, ya da mövcud kampaniyalara dəstək olun.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-white text-teal-700 font-bold px-8 py-3.5 rounded-full hover:bg-teal-50 transition-colors text-sm shadow-lg"
            >
              Müraciət et
            </Link>
            <Link
              href="/patients"
              className="inline-flex items-center justify-center border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm"
            >
              Xəstələrə bax
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
