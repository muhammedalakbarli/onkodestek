import { db } from "@/lib/db";
import { platformDonations } from "@/drizzle/schema";
import { desc, sql } from "drizzle-orm";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platformaya ianə — onkodəstək",
  description: "onkodəstək platformasının texniki xərclərini dəstəkləyin. Hər ianə platformanın davamlılığını təmin edir.",
};

export const revalidate = 60;

export default async function DonatePage() {
  let donors: (typeof platformDonations.$inferSelect)[] = [];
  let totalRaw = "0";

  try {
    donors = await db
      .select()
      .from(platformDonations)
      .orderBy(desc(platformDonations.createdAt));

    const [row] = await db
      .select({ total: sql<string>`coalesce(sum(amount), 0)` })
      .from(platformDonations);
    totalRaw = row?.total ?? "0";
  } catch { /* DB bağlantısı yoxdursa boş göstər */ }

  const total = parseFloat(totalRaw);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-900 via-teal-800 to-blue-900 py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <svg className="w-4 h-4 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span className="text-teal-200 text-sm font-medium">Platforma dəstəyi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Platformaya ianə edin
            </h1>
            <p className="text-teal-100/80 text-sm max-w-lg mx-auto">
              Xəstələrə gedən hər ianə 100% məqsədinə çatır. Lakin platformanın
              texniki xərcləri var — server, domen, inkişaf. Bu xərcləri
              platformanı dəstəkləyən insanlar ödəyir.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

          {/* Statistika */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-3xl font-extrabold text-teal-700">
                {total.toLocaleString("az-AZ")} <span className="text-lg font-medium text-slate-400">₼</span>
              </p>
              <p className="text-sm text-slate-500 mt-1">Platform üçün yığılan</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-3xl font-extrabold text-blue-700">{donors.length}</p>
              <p className="text-sm text-slate-500 mt-1">Dəstəkçi sayı</p>
            </div>
          </div>

          {/* Ödəniş məlumatları */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Ödəniş məlumatları</h2>
              <p className="text-sm text-slate-500 mt-0.5">Aşağıdakı hesaba köçürmə edin</p>
            </div>
            <div className="p-6 space-y-4">
              <PayRow label="Bank" value="Kapital Bank" />
              <PayRow label="Kart nömrəsi" value="5169 **** **** ****" copyable />
              <PayRow label="IBAN" value="AZ** KAPS **** **** **** **** ****" copyable />
              <PayRow label="Alıcı" value="onkodəstək Platforması" />
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-amber-700">
                  Kart məlumatları tezliklə əlavə ediləcək. Ətraflı məlumat üçün{" "}
                  <a href="https://t.me/onkodestek_admin" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                    admin ilə əlaqə saxlayın
                  </a>.
                </p>
              </div>
            </div>
          </div>

          {/* Platform nə üçün pul lazımdır */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Platforma xərcləri</h2>
            <div className="space-y-3">
              {[
                { label: "Server və hosting",    desc: "Vercel Pro, verilənlər bazası",      icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" },
                { label: "Domen adı",            desc: "onkodestek.az (illik)",              icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" },
                { label: "Fayl saxlama",         desc: "Sənəd və şəkil yükləmə servisi",    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
                { label: "Platforma inkişafı",   desc: "Yeni funksionallıqlar, təhlükəsizlik", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donor siyahısı */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">
                Dəstəkçilər
                <span className="ml-2 text-xs font-medium text-slate-400">({donors.length})</span>
              </h2>
            </div>
            {donors.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-slate-400">Hələ dəstəkçi yoxdur. İlk dəstəkçi siz olun!</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {donors.map((d) => (
                  <li key={d.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                        {d.isAnonymous
                          ? "?"
                          : (d.donorName?.[0]?.toUpperCase() ?? "?")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {d.isAnonymous ? "Anonim dəstəkçi" : (d.donorName ?? "Naməlum")}
                        </p>
                        {d.note && (
                          <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">"{d.note}"</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        +{parseFloat(d.amount as string).toLocaleString("az-AZ")} ₼
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(d.createdAt).toLocaleDateString("az-AZ", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Xəstəyə ianə CTA */}
          <div className="bg-gradient-to-br from-teal-600 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Xəstəyə birbaşa ianə etmək istəyirsiniz?</h2>
            <p className="text-blue-100 text-sm mb-5 max-w-md mx-auto">
              Hər xəstənin öz ianə səhifəsi var. İanəniz 100% həmin xəstəyə çatır.
            </p>
            <Link
              href="/patients"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-6 py-3 rounded-full hover:bg-teal-50 transition-colors text-sm shadow-lg"
            >
              Xəstələrə bax
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function PayRow({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs font-medium text-slate-400 w-32 shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-slate-800">{value}</span>
        {copyable && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">kopyala</span>
        )}
      </div>
    </div>
  );
}
