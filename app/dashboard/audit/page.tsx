import { db } from "@/lib/db";
import { auditLogs } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

const ACTION_LABELS: Record<string, string> = {
  "patient.create":        "Xəstə əlavə",
  "patient.update":        "Xəstə yeniləndi",
  "patient.delete":        "Xəstə silindi",
  "patient_update.create": "Xəstə xəbəri",
  "volunteer.review":      "Könüllü baxıldı",
  "transaction.add":       "Əməliyyat əlavə",
};

const ACTION_COLORS: Record<string, string> = {
  "patient.delete":  "bg-red-50 text-red-700 border-red-200",
  "patient.create":  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "patient.update":  "bg-blue-50 text-blue-700 border-blue-200",
  "patient_update.create": "bg-teal-50 text-teal-700 border-teal-200",
  "volunteer.review": "bg-violet-50 text-violet-700 border-violet-200",
};

export default async function AuditPage() {
  let logs: (typeof auditLogs.$inferSelect)[] = [];
  try {
    logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(200);
  } catch { /* cədvəl hələ yoxdursa */ }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Audit jurnalı</h1>
        <p className="text-slate-500 text-sm mt-1">Admin əməliyyatlarının tam qeydi</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">Hələlik heç bir əməliyyat qeyd edilməyib.</p>
          <p className="text-slate-300 text-xs mt-1">Miqrasiya tamamlandıqdan sonra qeydlər burada görünəcək.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm">Son 200 əməliyyat</h2>
            <span className="text-xs text-slate-400">{logs.length} qeyd</span>
          </div>
          <div className="divide-y divide-slate-50">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                <span className={`shrink-0 inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  ACTION_COLORS[log.action] ?? "bg-slate-50 text-slate-600 border-slate-200"
                }`}>
                  {ACTION_LABELS[log.action] ?? log.action}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium truncate">{log.adminEmail}</p>
                  {log.detail && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{log.detail}</p>
                  )}
                </div>
                {log.entityType && log.entityId && (
                  <span className="shrink-0 text-xs text-slate-400 font-mono">
                    {log.entityType}#{log.entityId}
                  </span>
                )}
                <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
