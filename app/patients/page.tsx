import Navbar from "@/components/Navbar";
import PatientFilter from "@/components/PatientFilter";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";
import type { Patient } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Xəstələr",
  description: "Tibbi sənədləri yoxlanılmış xəstələrin aktiv yardım kampaniyaları. Hər xəstəyə birbaşa dəstək ol.",
};

export default async function PatientsPage() {
  let list: Patient[] = [];
  try {
    list = await db
      .select()
      .from(patients)
      .where(eq(patients.isPublic, true))
      .orderBy(patients.createdAt);
  } catch {
    // DB bağlantısı yoxdursa boş göstər
  }

  const activeCount = list.filter((p) => p.status === "active").length;
  const fundedCount = list.filter((p) => p.status === "funded").length;

  return (
    <>
      <Navbar />

      {/* Səhifə başlığı */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Yardım kampaniyaları</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Xəstələr</h1>
          <p className="text-slate-500 text-sm">
            Tibbi sənədləri yoxlanılmış xəstələrin aktiv yardım kampaniyaları
          </p>

          {list.length > 0 && (
            <div className="flex gap-4 mt-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                {activeCount} aktiv kampaniya
              </span>
              {fundedCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1 rounded-full">
                  ✓ {fundedCount} tamamlandı
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {list.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">
              🏥
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Hələlik açıq müraciət yoxdur</h2>
            <p className="text-slate-400 text-sm mb-6">Yeni kampaniyalar üçün Telegram botunu izləyin.</p>
            <a
              href="https://t.me/OnkoDestek_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm"
            >
              Telegram botuna keç
            </a>
          </div>
        ) : (
          <PatientFilter patients={list} />
        )}
      </main>
      <Footer />
    </>
  );
}
