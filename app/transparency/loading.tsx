import Navbar from "@/components/Navbar";
import { SkeletonTable } from "@/components/SkeletonCard";

export default function TransparencyLoading() {
  return (
    <>
      <Navbar />
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-2">
          <div className="h-3 bg-slate-100 rounded w-32" />
          <div className="h-8 bg-slate-100 rounded w-40" />
          <div className="h-4 bg-slate-100 rounded w-96" />
        </div>
      </div>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid sm:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="w-9 h-9 bg-slate-100 rounded-xl mb-4" />
              <div className="h-7 bg-slate-100 rounded w-28 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-36" />
            </div>
          ))}
        </div>
        <SkeletonTable rows={12} />
      </main>
    </>
  );
}
