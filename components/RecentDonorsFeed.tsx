"use client";

import { useEffect, useState } from "react";

interface Donor {
  id: number;
  donorName: string | null;
  isAnonymous: boolean;
  amount: string;
  patientName: string | null;
  createdAt: string;
}

export default function RecentDonorsFeed() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [visible, setVisible] = useState<Donor | null>(null);
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/recent-donations");
        if (res.ok) setDonors(await res.json());
      } catch {}
    }
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (donors.length === 0) return;
    const timer = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % donors.length);
        setShow(true);
      }, 400);
    }, 5000);
    if (donors.length > 0) {
      setVisible(donors[0]);
      setTimeout(() => setShow(true), 500);
    }
    return () => clearInterval(timer);
  }, [donors]);

  useEffect(() => {
    if (donors.length > 0) setVisible(donors[idx]);
  }, [idx, donors]);

  if (!visible) return null;

  const name = visible.isAnonymous ? "Anonim" : (visible.donorName ?? "Birisi");
  const amount = parseFloat(visible.amount).toLocaleString("az-AZ");
  const patient = visible.patientName;
  const mins = Math.max(1, Math.round((Date.now() - new Date(visible.createdAt).getTime()) / 60000));
  const timeLabel = mins < 60
    ? `${mins} dəq əvvəl`
    : mins < 1440
    ? `${Math.round(mins / 60)} saat əvvəl`
    : `${Math.round(mins / 1440)} gün əvvəl`;

  return (
    <div
      className={`fixed bottom-6 left-4 z-50 transition-all duration-400 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 max-w-xs">
        <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 text-emerald-700 font-bold text-sm">
          {name[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {name} <span className="text-emerald-600">+{amount} ₼</span> ianə etdi
          </p>
          {patient && (
            <p className="text-xs text-slate-400 truncate">{patient} · {timeLabel}</p>
          )}
        </div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0 animate-pulse" />
      </div>
    </div>
  );
}
