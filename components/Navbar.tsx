import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.jpeg"
            alt="onkodəstək"
            width={40}
            height={40}
            className="rounded-lg object-contain"
            priority
          />
          <div className="leading-none">
            <span className="font-bold text-slate-900 text-base tracking-tight">
              onko<span className="text-teal-600">dəstək</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wide">Həyata dəstək ol</span>
          </div>
        </Link>

        {/* Nav linklər */}
        <div className="hidden sm:flex items-center gap-1">
          {[
            { href: "/patients",     label: "Xəstələr" },
            { href: "/transparency", label: "Şəffaflıq" },
            { href: "/about",        label: "Haqqımızda" },
            { href: "/contact",      label: "Əlaqə" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-lg transition-all font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Sağ tərəf: auth + CTA */}
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link
                href="/me"
                className="hidden sm:flex items-center gap-2 text-sm text-slate-700 hover:text-teal-600 font-medium px-3 py-2 rounded-lg hover:bg-teal-50 transition-all"
              >
                {session.user.image ? (
                  <Image src={session.user.image} alt="" width={24} height={24} className="rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xs font-bold">
                    {session.user.name?.[0] ?? "U"}
                  </div>
                )}
                {session.user.name?.split(" ")[0]}
              </Link>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button
                  type="submit"
                  className="text-xs text-slate-500 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all font-medium"
                >
                  Çıxış
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-slate-700 hover:text-teal-600 font-medium px-3 py-2 rounded-lg hover:bg-teal-50 transition-all"
            >
              Daxil ol
            </Link>
          )}

          <Link
            href="/apply"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="hidden sm:inline">Müraciət et</span>
            <span className="sm:hidden">Müraciət</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
