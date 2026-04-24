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

          <a
            href="https://t.me/OnkoDestek_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8c-.12.58-.45.72-.91.45l-2.52-1.86-1.21 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1l-5.74 3.62-2.47-.77c-.54-.17-.55-.54.11-.8l9.64-3.72c.45-.16.84.11.69.53z"/>
            </svg>
            <span className="hidden sm:inline">Müraciət et</span>
            <span className="sm:hidden">Bot</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
