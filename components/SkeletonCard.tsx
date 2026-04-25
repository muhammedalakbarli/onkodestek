export function SkeletonPatientCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1.5 bg-slate-100" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
            <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
          </div>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full mb-2" />
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[40, 24, 20, 32, 16, 12].map((w, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className={`h-3.5 bg-slate-100 rounded-lg w-${w}`} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 10 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-slate-50">
        <div className="h-4 bg-slate-100 rounded w-40" />
      </div>
      <div className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            <div className="h-3.5 bg-slate-100 rounded w-24" />
            <div className="h-3.5 bg-slate-100 rounded w-32 flex-1" />
            <div className="h-3.5 bg-slate-100 rounded w-16" />
            <div className="h-3.5 bg-slate-100 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
