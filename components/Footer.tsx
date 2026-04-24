import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-500 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">onkodəstək</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs">
            <Link href="/patients"     className="hover:text-white transition-colors">Xəstələr</Link>
            <Link href="/transparency" className="hover:text-white transition-colors">Şəffaflıq</Link>
            <Link href="/about"        className="hover:text-white transition-colors">Haqqımızda</Link>
            <Link href="/apply"        className="hover:text-white transition-colors">Müraciət</Link>
            <Link href="/track"        className="hover:text-white transition-colors">İzlə</Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Məxfilik</Link>
            <Link href="/terms"   className="hover:text-white transition-colors">Şərtlər</Link>
            <a
              href="https://t.me/onkodestek_admin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Əlaqə
            </a>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-6 pt-4 text-center text-xs">
          © 2026 onkodəstək — Azərbaycanda onkoloji xəstəliklərə şəffaf dəstək
        </div>
      </div>
    </footer>
  );
}
