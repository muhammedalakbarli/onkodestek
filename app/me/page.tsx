import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { transactions, patients } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/me");

  const myDonations = await db
    .select({
      id:           transactions.id,
      amount:       transactions.amount,
      isAnonymous:  transactions.isAnonymous,
      createdAt:    transactions.createdAt,
      description:  transactions.description,
      patientId:    transactions.patientId,
      patientName:  patients.fullName,
      patientTrack: patients.trackId,
    })
    .from(transactions)
    .leftJoin(patients, eq(transactions.patientId, patients.id))
    .where(eq(transactions.donorUserId, session.user.id))
    .orderBy(desc(transactions.createdAt));

  const totalDonated = myDonations.reduce(
    (sum, d) => sum + parseFloat(d.amount as string),
    0
  );

  const initials = session.user.name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "U";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">

        {/* Profil banner */}
        <div className="bg-gradient-to-br from-blue-900 via-teal-800 to-blue-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Avatar */}
              <div className="shrink-0">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-teal-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/20 shadow-lg">
                    {initials}
                  </div>
                )}
              </div>
              {/* Ad / email */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-extrabold text-white">{session.user.name}</h1>
                <p className="text-teal-200 text-sm mt-0.5">{session.user.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-teal-200 font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Aktiv hesab
                  </span>
                  <span className="text-xs text-teal-300/60">Google ilə daxil olub</span>
                </div>
              </div>
              {/* Çıxış */}
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Çıxış
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Xülasə kartlar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{formatCurrency(totalDonated)}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Ümumi ianə</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{myDonations.length}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">İanə sayı</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm col-span-2 sm:col-span-1">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {new Set(myDonations.map((d) => d.patientId)).size}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Dəstəklənən xəstə</p>
            </div>
          </div>

          {/* Müraciət izləmə */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Müraciəti izlə</h2>
                <p className="text-xs text-slate-500">Müraciət etdikdən sonra aldığınız kodu daxil edin</p>
              </div>
            </div>
            <form action="/track" method="GET" className="flex gap-2">
              <input
                type="text"
                name="id"
                placeholder="OKD-XXXXXX"
                maxLength={12}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400 uppercase font-mono"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
              >
                Axtar
              </button>
            </form>
          </div>

          {/* İanə tarixçəsi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">İanə tarixçəsi</h2>
              <Link
                href="/patients"
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
              >
                Xəstələrə bax
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {myDonations.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold mb-1">Hələ ianə etməmisiniz</p>
                <p className="text-sm text-slate-400 mb-5">Xəstələr siyahısına baxın və dəstəyinizi göstərin</p>
                <Link
                  href="/patients"
                  className="inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
                >
                  Xəstələrə bax
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {myDonations.map((d) => (
                  <li key={d.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {d.patientName ?? "Naməlum xəstə"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(d.createdAt).toLocaleDateString("az-AZ", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                          {d.description ? ` · ${d.description}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-sm font-bold text-emerald-600 tabular-nums">
                        +{formatCurrency(parseFloat(d.amount as string))}
                      </p>
                      {d.patientTrack && (
                        <Link
                          href={`/track?id=${d.patientTrack}`}
                          className="text-xs text-teal-500 hover:text-teal-700 mt-0.5 block transition-colors"
                        >
                          İzlə →
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Hesab məlumatları */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Hesab məlumatları</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-700">Ad Soyad</p>
                  <p className="text-sm text-slate-500 mt-0.5">{session.user.name}</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Google-dan</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-700">E-poçt</p>
                  <p className="text-sm text-slate-500 mt-0.5">{session.user.email}</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Təsdiqlənib</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Giriş üsulu</p>
                  <p className="text-sm text-slate-500 mt-0.5">Google OAuth</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100">
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Hesabdan çıx
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
