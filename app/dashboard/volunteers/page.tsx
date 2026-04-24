import { db } from "@/lib/db";
import { volunteerRequests } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

const AREA_LABELS: Record<string, string> = {
  tibbi:     "Tibbi dəstək",
  hüquqi:    "Hüquqi yardım",
  texniki:   "Texniki dəstək",
  media:     "Media / PR",
  psixoloji: "Psixoloji dəstək",
  digər:     "Digər",
};

export default async function VolunteersPage() {
  let list: (typeof volunteerRequests.$inferSelect)[] = [];

  try {
    list = await db
      .select()
      .from(volunteerRequests)
      .orderBy(desc(volunteerRequests.createdAt));
  } catch { /* DB bağlantısı yoxdursa boş göstər */ }

  const newCount = list.filter((v) => !v.isReviewed).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Könüllü müraciətləri</h1>
          <p className="text-slate-500 text-sm mt-1">
            Cəmi {list.length} müraciət
            {newCount > 0 && (
              <span className="ml-2 text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                {newCount} yeni
              </span>
            )}
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">Hələlik könüllü müraciəti yoxdur.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((v) => (
            <div key={v.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${v.isReviewed ? "border-slate-100" : "border-teal-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-slate-900">{v.fullName}</p>
                    <span className="text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">
                      {AREA_LABELS[v.area] ?? v.area}
                    </span>
                    {!v.isReviewed && (
                      <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                        Yeni
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <a href={`mailto:${v.email}`} className="hover:text-teal-600 transition-colors">{v.email}</a>
                    {v.phone && <a href={`tel:${v.phone}`} className="hover:text-teal-600 transition-colors">{v.phone}</a>}
                  </div>
                  {v.message && (
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{v.message}</p>
                  )}
                </div>
                <p className="text-xs text-slate-400 shrink-0">{formatDate(v.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
