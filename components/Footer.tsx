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
