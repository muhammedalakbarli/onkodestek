import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-500 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpeg" alt="onkodəstək" width={28} height={28} className="rounded-lg object-contain" />
            <span className="text-white font-semibold text-sm">onkodəstək</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs">
            <Link href="/patients"     className="hover:text-white transition-colors">Xəstələr</Link>
            <Link href="/transparency" className="hover:text-white transition-colors">Şəffaflıq</Link>
            <Link href="/about"        className="hover:text-white transition-colors">Haqqımızda</Link>
            <Link href="/apply"        className="hover:text-white transition-colors">Müraciət</Link>
            <Link href="/track"        className="hover:text-white transition-colors">İzlə</Link>
            <Link href="/contact"      className="hover:text-white transition-colors">Əlaqə</Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://t.me/OnkoDestek_bot"
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram botu"
              className="w-8 h-8 bg-slate-800 hover:bg-teal-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8c-.12.58-.45.72-.91.45l-2.52-1.86-1.21 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1l-5.74 3.62-2.47-.77c-.54-.17-.55-.54.11-.8l9.64-3.72c.45-.16.84.11.69.53z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/onkodestek"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="w-8 h-8 bg-slate-800 hover:bg-teal-700 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <Link
              href="/contact"
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Əlaqə
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-6 pt-4 text-center text-xs">
          © 2026 onkodəstək — Azərbaycanda onkoloji xəstəliklərə şəffaf dəstək
        </div>
      </div>
    </footer>
  );
}
