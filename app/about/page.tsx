import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search, ShieldCheck, Heart, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Haqqımızda",
  description: "onkodəstək — Azərbaycanda onkoloji xəstəliklərə qarşı şəffaf xeyriyyəçilik platforması. Missiyamız, dəyərlərimiz və komandamız haqqında.",
};

const VALUES = [
  {
    Icon: Search,
    color: "text-blue-600 bg-blue-50",
    title: "Şəffaflıq",
    desc: "Toplanmış hər qəpik açıq şəkildə hesabat verilir. Heç bir xərc qəbzsiz edilmir.",
  },
  {
    Icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-50",
    title: "Etibarlılıq",
    desc: "Hər müraciət sənəd yoxlamasından keçir. Yalnız təsdiqlənmiş xəstələr ictimaiyyətə açılır.",
  },
  {
    Icon: Heart,
    color: "text-rose-600 bg-rose-50",
    title: "İnsanlıq",
    desc: "Biz yardımı rəqəmsallaşdırırıq, amma insanı mərkəzdə saxlayırıq.",
  },
  {
    Icon: Zap,
    color: "text-amber-600 bg-amber-50",
    title: "Sürət",
    desc: "Müraciətlər 1–3 iş günü ərzində yoxlanılır. Vəsait birbaşa xəstəyə çatır.",
  },
];

const STEPS = [
  { num: "01", title: "Müraciət",    desc: "Xəstə ailəsi sayt forması və ya Telegram botu vasitəsilə müraciət edir." },
  { num: "02", title: "Yoxlama",     desc: "Komandamız tibbi sənədləri, xəstəxana arayışını və ehtiyacı yoxlayır." },
  { num: "03", title: "Yayım",       desc: "Yoxlanılmış xəstənin kampaniyası saytda ictimaiyyətə açılır." },
  { num: "04", title: "Yığım",       desc: "İanəçilər kampaniyaya dəstək verir. Hər ianə qeydə alınır." },
  { num: "05", title: "Xərclənmə",   desc: "Vəsait xəstəxanaya / əczaçılığa birbaşa köçürülür." },
  { num: "06", title: "Hesabat",     desc: "Hər xərc rəsmi qəbzlə saytda dərc edilir. Heç nə silinmir." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-4">Haqqımızda</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Hər ianənin arxasında<br />şəffaf bir sistem var
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
            onkodəstək — Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə maddi
            və psixoloji dəstək göstərən rəqəmsal xeyriyyəçilik platformasıdır.
          </p>
        </div>
      </section>

      {/* Missiya */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Missiyamız</p>
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
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${v.color}`}>
                  <v.Icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Necə işləyir */}
      <section className="bg-white border-t border-slate-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Proses</p>
            <h2 className="text-3xl font-bold text-slate-900">Müraciətdən xərclənməyə</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map((s) => (
              <div key={s.num} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <span className="text-5xl font-black text-slate-100 absolute top-4 right-5 select-none leading-none">{s.num}</span>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Siz də dəstək ola bilərsiniz</h2>
          <p className="text-slate-300 mb-8">Yardıma ehtiyacı olan xəstə varsa müraciət edin, və ya mövcud kampaniyalara dəstək olun.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors text-sm"
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
