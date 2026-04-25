import Navbar from "@/components/Navbar";
import { SkeletonPatientCard } from "@/components/SkeletonCard";

export default function PatientsLoading() {
  return (
    <>
      <Navbar />
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-slate-100 rounded w-32" />
            <div className="h-8 bg-slate-100 rounded w-48" />
            <div className="h-4 bg-slate-100 rounded w-80" />
          </div>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonPatientCard key={i} />
          ))}
        </div>
      </main>
    </>
  );
}
