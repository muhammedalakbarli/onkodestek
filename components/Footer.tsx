import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">

      {/* ── Əsas bölmə ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brend + təsvir */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.jpeg"
                alt="OnkoDəstək"
                width={36}
                height={36}
                className="rounded-xl object-contain shrink-0"
              />
              <div>
                <p className="text-white font-bold text-base leading-none">OnkoDəstək</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Həyata dəstək ol</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 mb-5 max-w-xs">
              Azərbaycanda onkoloji xəstələrə sənədli, şəffaf və birbaşa maliyyə dəstəyi platforması.
            </p>

            {/* Güvən nişanları */}
            <div className="flex flex-col gap-2">
              {[
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Sənəd yoxlaması" },
                { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "100% şəffaf hesabat" },
                { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "Birbaşa köçürmə" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2 text-xs text-slate-500">
                  <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                  </svg>
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Platforma linkləri */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Platforma</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                { href: "/patients",     label: "Xəstələr" },
                { href: "/transparency", label: "Şəffaflıq" },
                { href: "/about",        label: "Haqqımızda" },
                { href: "/donate",       label: "Platforma ianəsi" },
                { href: "/track",        label: "İzləmə kodu" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dəstək linkləri */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Dəstək</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                { href: "/apply",     label: "Yardım müraciəti" },
                { href: "/volunteer", label: "Könüllü ol" },
                { href: "/contact",   label: "Bizimlə əlaqə" },
                {
                  href: "https://t.me/OnkoDestek_bot",
                  label: "Telegram botu",
                  external: true,
                },
                {
                  href: "https://t.me/onkodestek_admin",
                  label: "Admin ilə əlaqə",
                  external: true,
                },
              ].map((l) => (
                <li key={l.label}>
                  {"external" in l && l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors flex items-center gap-1"
                    >
                      {l.label}
                      <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link href={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Əlaqə + sosial */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Əlaqə</p>
            <ul className="flex flex-col gap-2.5 text-sm mb-6">
              <li>
                <a
                  href="mailto:info@onkodestek.az"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@onkodestek.az
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/onkodestek_admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8c-.12.58-.45.72-.91.45l-2.52-1.86-1.21 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1l-5.74 3.62-2.47-.77c-.54-.17-.55-.54.11-.8l9.64-3.72c.45-.16.84.11.69.53z"/>
                  </svg>
                  Telegram
                </a>
              </li>
            </ul>

            {/* Sosial media ikonları */}
            <p className="text-white font-semibold text-sm mb-3">Sosial media</p>
            <div className="flex gap-2">
              {[
                {
                  href: "https://t.me/OnkoDestek_bot",
                  label: "Telegram",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8c-.12.58-.45.72-.91.45l-2.52-1.86-1.21 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1l-5.74 3.62-2.47-.77c-.54-.17-.55-.54.11-.8l9.64-3.72c.45-.16.84.11.69.53z"/>
                    </svg>
                  ),
                },
                {
                  href: "https://instagram.com/onkodestek",
                  label: "Instagram",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-9 h-9 bg-slate-800 hover:bg-teal-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Alt zolaq ──────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © 2026 OnkoDəstək. Bütün hüquqlar qorunur.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Məxfilik siyasəti</Link>
            <Link href="/terms"   className="hover:text-slate-400 transition-colors">İstifadə şərtləri</Link>
            <Link href="/me"      className="hover:text-slate-400 transition-colors">Hesabım</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
