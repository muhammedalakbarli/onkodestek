import { auth, signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;

  // ── Admin session varsa — seçim göstər ──────────────────────────────────────
  if (session?.user?.role === "admin") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image src="/logo.jpeg" alt="onkodəstək" width={52} height={52} className="rounded-2xl object-contain mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">Xoş gəldiniz</h1>
            <p className="text-slate-500 text-sm mt-1">{session.user.name ?? session.user.email}</p>
          </div>

          <p className="text-xs text-slate-400 text-center mb-4 uppercase tracking-wide font-semibold">
            Daxil olmaq istədiyiniz paneli seçin
          </p>

          <div className="space-y-3">
            {/* Admin paneli — promote-admin route cookie qoyur + /dashboard-a yönləndirir */}
            <a
              href="/api/auth/promote-admin"
              className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
              Admin paneli
            </a>

            {/* İstifadəçi kimi */}
            <a
              href={callbackUrl ?? "/patients"}
              className="w-full flex items-center justify-center gap-2.5 border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-slate-700 hover:text-teal-700 font-semibold py-3.5 rounded-xl text-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              İstifadəçi kimi davam et
            </a>
          </div>

          {/* Çıxış */}
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }} className="mt-5 text-center">
            <button type="submit" className="text-xs text-slate-400 hover:text-red-500 transition-colors">
              Başqa hesabla daxil ol
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Normal donor — artıq daxil olub ─────────────────────────────────────────
  if (session?.user) {
    redirect("/patients");
  }

  // ── Giriş formu ─────────────────────────────────────────────────────────────
  const errorMessages: Record<string, string> = {
    OAuthSignin:        "Giriş zamanı xəta baş verdi. Yenidən cəhd edin.",
    OAuthCallback:      "Google ilə əlaqə qurularkən xəta baş verdi.",
    OAuthCreateAccount: "Hesab yaradılarkən xəta baş verdi.",
    Unauthorized:       "Bu hesabın admin icazəsi yoxdur.",
    Default:            "Giriş uğursuz oldu. Zəhmət olmasa yenidən cəhd edin.",
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* Sol panel — brend */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-teal-800 to-blue-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-3">
          <Image src="/logo.jpeg" alt="OnkoDəstək" width={44} height={44} className="rounded-xl object-contain" />
          <div>
            <p className="text-white font-bold text-lg leading-none">OnkoDəstək</p>
            <p className="text-teal-200 text-xs mt-0.5">Həyata dəstək ol</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight mb-4">
            <span className="bg-gradient-to-r from-teal-300 to-blue-200 bg-clip-text text-transparent">Şəffaf yardım,</span>
            <br />
            <span className="text-white">ölçülə bilən təsir</span>
          </h2>
          <p className="text-teal-100/80 text-sm leading-relaxed mb-8">
            Etdiyiniz hər ianə birbaşa xəstəyə çatır.
            Hər qəpiyin hara getdiyini real vaxtda izləyirsiniz.
          </p>
          <div className="space-y-3">
            {[
              "Hər xəstə tibbi sənəd yoxlamasından keçir",
              "Hər xərc rəsmi qəbzlə açıqlanır",
              "İanə tarixçəniz həmişə əlinizdədir",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2.5">
                <div className="w-5 h-5 bg-emerald-400/20 border border-emerald-400/40 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-teal-50 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-teal-300/70 text-xs">© 2026 OnkoDəstək</p>
      </div>

      {/* Sağ panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobil logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <Image src="/logo.jpeg" alt="OnkoDəstək" width={36} height={36} className="rounded-xl object-contain" />
          <span className="font-bold text-slate-900 text-lg">OnkoDəstək</span>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Xoş gəldiniz</h1>
          <p className="text-slate-500 text-sm mb-8">
            Daxil olun və ya qonaq kimi platformaya baxın
          </p>

          {/* Xəta mesajı */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">
                {errorMessages[error] ?? errorMessages.Default}
              </p>
            </div>
          )}

          <LoginForm callbackUrl={callbackUrl} />

          {/* Qonaq kimi bax */}
          <div className="mt-3">
            <a
              href="/patients"
              className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-slate-600 hover:text-teal-700 font-medium py-3.5 px-5 rounded-xl transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Qonaq kimi bax
            </a>
            <p className="text-xs text-slate-400 text-center mt-2">Müraciət etmək üçün giriş tələb olunur</p>
          </div>

          {/* Müraciət izlə */}
          <div className="mt-8 pt-7 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4 text-center">
              Müraciətin statusunu izlə
            </p>
            <form action="/track" method="GET">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="id"
                  placeholder="İzləmə kodu (OKD-XXXXXX)"
                  maxLength={12}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-400 uppercase"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
                >
                  İzlə
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                İzləmə kodunu müraciət etdikdən sonra alırsınız
              </p>
            </form>
          </div>

        </div>

        <p className="mt-12 text-xs text-slate-400 text-center">
          © 2026 OnkoDəstək
        </p>
      </div>
    </div>
  );
}
