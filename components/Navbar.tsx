import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <div className="leading-none">
            <span className="font-bold text-slate-900 text-base tracking-tight">onkodəstək</span>
            <span className="block text-[10px] text-blue-600 font-medium tracking-wide">Həyata dəstək ol</span>
          </div>
        </Link>

        {/* Nav linklər */}
        <div className="hidden sm:flex items-center gap-1">
          {[
            { href: "/patients",     label: "Xəstələr" },
            { href: "/transparency", label: "Şəffaflıq" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA düyməsi */}
        <a
          href="https://t.me/OnkoDestek_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8c-.12.58-.45.72-.91.45l-2.52-1.86-1.21 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1l-5.74 3.62-2.47-.77c-.54-.17-.55-.54.11-.8l9.64-3.72c.45-.16.84.11.69.53z"/>
          </svg>
          Müraciət et
        </a>
      </div>
    </nav>
  );
}
