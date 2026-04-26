"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import PatientCard from "./PatientCard";
import type { Patient } from "@/drizzle/schema";

const LIMIT = 9;

export default function PatientFeed({
  initialPatients,
  initialHasMore,
  isGuest,
}: {
  initialPatients: Patient[];
  initialHasMore: boolean;
  isGuest: boolean;
}) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [hasMore, setHasMore]   = useState(initialHasMore);
  const [loading, setLoading]   = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const offsetRef   = useRef(initialPatients.length);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/patients?offset=${offsetRef.current}&limit=${LIMIT}`);
      const data = await res.json() as { patients: Patient[]; hasMore: boolean };
      setPatients((prev) => [...prev, ...data.patients]);
      setHasMore(data.hasMore);
      offsetRef.current += data.patients.length;
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [loading, hasMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {patients.map((p) => (
          <PatientCard key={p.id} patient={p} isGuest={isGuest} />
        ))}
      </div>

      {/* Sentinel — viewport-a girəndə loadMore tetiklenir */}
      <div ref={sentinelRef} className="h-4" />

      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {!hasMore && patients.length > 0 && (
        <p className="text-center text-sm text-slate-400 py-8">
          Bütün xəstələr göstərildi — cəmi {patients.length} kampaniya
        </p>
      )}
    </>
  );
}
