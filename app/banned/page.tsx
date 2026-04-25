import { auth } from "@/auth";
import { getUserBanStatus } from "@/lib/checkBan";
import Link from "next/link";

export const metadata = { title: "Hesab bloklandı" };

export default async function BannedPage() {
  const session = await auth();
  const userId  = session?.user?.id;

  const { bannedUntil, banReason } = userId
    ? await getUserBanStatus(userId)
    : { bannedUntil: null, banReason: null };

  const isPermanent = bannedUntil
    ? bannedUntil.getFullYear() >= 2099
    : false;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-2">Hesabınız bloklandı</h1>

        {isPermanent ? (
          <p className="text-slate-500 text-sm mb-4">
            Hesabınız daimi olaraq bloklanmışdır.
          </p>
        ) : bannedUntil ? (
          <p className="text-slate-500 text-sm mb-4">
            Hesabınız{" "}
            <span className="font-semibold text-slate-700">
              {bannedUntil.toLocaleDateString("az-AZ", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>{" "}
            tarixinə qədər bloklanmışdır.
          </p>
        ) : null}

        {banReason && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-left">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Səbəb</p>
            <p className="text-sm text-red-700">{banReason}</p>
          </div>
        )}

        <p className="text-xs text-slate-400 mb-6">
          Əgər bunun səhv olduğunu düşünürsünüzsə, bizimlə əlaqə saxlayın.
        </p>

        <div className="flex flex-col gap-2">
          <Link
            href="/contact"
            className="w-full py-2.5 px-4 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            Əlaqə saxla
          </Link>
          <Link
            href="/login"
            className="w-full py-2.5 px-4 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            Başqa hesabla daxil ol
          </Link>
        </div>
      </div>
    </div>
  );
}
