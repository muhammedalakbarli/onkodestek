import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { transactions, patients } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function MePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/me");

  // Bu donorun bütün ianələri
  const myDonations = await db
    .select({
      id:            transactions.id,
      amount:        transactions.amount,
      isAnonymous:   transactions.isAnonymous,
      createdAt:     transactions.createdAt,
      description:   transactions.description,
      patientId:     transactions.patientId,
      patientName:   patients.fullName,
      patientTrack:  patients.trackId,
    })
    .from(transactions)
    .leftJoin(patients, eq(transactions.patientId, patients.id))
    .where(eq(transactions.donorUserId, session.user.id))
    .orderBy(desc(transactions.createdAt));

  const totalDonated = myDonations.reduce(
    (sum, d) => sum + parseFloat(d.amount as string),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {session.user.name?.[0] ?? "U"}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-slate-900">{session.user.name}</h1>
                <p className="text-sm text-slate-500">{session.user.email}</p>
              </div>
            </div>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
              <button
                type="submit"
                className="text-sm text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all"
              >
                Çıxış
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Xülasə kartlar */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Ümumi ianə
            </p>
            <p className="text-3xl font-extrabold text-slate-900">
              {totalDonated.toLocaleString("az-AZ")}
              <span className="text-base font-medium text-slate-400 ml-1">₼</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              İanə sayı
            </p>
            <p className="text-3xl font-extrabold text-slate-900">
              {myDonations.length}
              <span className="text-base font-medium text-slate-400 ml-1">dəfə</span>
            </p>
          </div>
        </div>

        {/* İanə tarixçəsi */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">İanə tarixçəsi</h2>
            <Link
              href="/patients"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Xəstələrə bax →
            </Link>
          </div>

          {myDonations.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium mb-1">Hələ ianə etməmisiniz</p>
              <p className="text-sm text-slate-400 mb-5">Xəstələr siyahısına baxın və dəstəyinizi göstərin</p>
              <Link
                href="/patients"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Xəstələrə bax
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {myDonations.map((d) => (
                <li key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {d.patientName ?? "Naməlum xəstə"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(d.createdAt).toLocaleDateString("az-AZ", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {d.description ? ` · ${d.description}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">
                      +{parseFloat(d.amount as string).toLocaleString("az-AZ")} ₼
                    </p>
                    {d.patientTrack && (
                      <Link
                        href={`/track?id=${d.patientTrack}`}
                        className="text-xs text-blue-500 hover:text-blue-700 mt-0.5 block"
                      >
                        İzlə
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
