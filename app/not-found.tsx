import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <Image src="/logo.jpeg" alt="OnkoDəstək" width={56} height={56} className="rounded-2xl object-contain mb-6" />

      <p className="text-7xl font-black text-slate-200 mb-2 select-none">404</p>
      <h1 className="text-xl font-bold text-slate-800 mb-2">Səhifə tapılmadı</h1>
      <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">
        Axtardığınız səhifə mövcud deyil və ya silinmiş ola bilər.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Ana səhifə
        </Link>
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-teal-300 text-slate-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          Xəstələrə bax
        </Link>
      </div>
    </div>
  );
}
