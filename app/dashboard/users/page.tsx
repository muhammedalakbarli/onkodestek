"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "admin" | "donor";
  createdAt: string;
  bannedUntil: string | null;
  banReason: string | null;
  donationCount: number;
  donationTotal: string;
};

const BAN_DURATIONS = [
  { label: "1 gün",    days: 1 },
  { label: "7 gün",    days: 7 },
  { label: "30 gün",   days: 30 },
  { label: "Daimi",    days: 0 },
];

function isBanned(u: User): boolean {
  if (!u.bannedUntil) return false;
  return new Date(u.bannedUntil) > new Date();
}

function BanModal({
  user,
  onClose,
  onDone,
}: {
  user: User;
  onClose: () => void;
  onDone: () => void;
}) {
  const [days, setDays]     = useState(1);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ban", days, reason }),
    });
    setSaving(false);
    onDone();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">İstifadəçini blokla</h2>
        <p className="text-sm text-slate-500 mb-4 truncate">{user.name} — {user.email}</p>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Müddət</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {BAN_DURATIONS.map((d) => (
            <button
              key={d.days}
              type="button"
              onClick={() => setDays(d.days)}
              className={`py-2 text-sm font-semibold rounded-xl border-2 transition-all ${
                days === d.days
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Səbəb (ixtiyari)</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder="Qaydaları pozmaq, spam və s."
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {saving ? "..." : "Blokla"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<"all" | "banned">("all");
  const [banTarget, setBanTarget] = useState<User | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleUnban(u: User) {
    await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unban" }),
    });
    await load();
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ? true : isBanned(u);
    return matchSearch && matchFilter;
  });

  const totalDonors  = users.filter((u) => u.donationCount > 0).length;
  const totalDonated = users.reduce((s, u) => s + parseFloat(u.donationTotal), 0);
  const bannedCount  = users.filter(isBanned).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {banTarget && (
        <BanModal
          user={banTarget}
          onClose={() => setBanTarget(null)}
          onDone={() => { setBanTarget(null); load(); }}
        />
      )}

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">İstifadəçilər</h1>
        <p className="text-slate-500 text-sm mt-1">
          Platformaya qeydiyyatdan keçmiş bütün istifadəçilər
        </p>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-slate-900">{users.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Ümumi istifadəçi</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-emerald-700">{totalDonors}</p>
          <p className="text-xs text-slate-500 mt-0.5">İanə edən</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-blue-700">
            {totalDonated.toLocaleString("az-AZ")} ₼
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Ümumi ianə</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-red-600">{bannedCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Bloklanmış</p>
        </div>
      </div>

      {/* Filter + Axtarış */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ad və ya e-poçtla axtar..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0">
          {(["all", "banned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f
                  ? f === "banned"
                    ? "bg-red-500 text-white"
                    : "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? "Hamısı" : `Bloklanmış (${bannedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Cədvəl */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">Yüklənir...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm">İstifadəçi tapılmadı.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">İstifadəçi</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">E-poçt</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rol / Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">İanələr</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Qoşulma tarixi</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((u) => {
                  const banned = isBanned(u);
                  const isPermanent = u.bannedUntil
                    ? new Date(u.bannedUntil).getFullYear() >= 2099
                    : false;
                  return (
                    <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${banned ? "bg-red-50/40" : ""}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            {u.image ? (
                              <Image
                                src={u.image}
                                alt=""
                                width={36}
                                height={36}
                                className={`rounded-full ${banned ? "opacity-50 grayscale" : ""}`}
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${banned ? "bg-slate-200 text-slate-400" : "bg-teal-100 text-teal-700"}`}>
                                {u.name?.[0]?.toUpperCase() ?? u.email?.[0]?.toUpperCase() ?? "?"}
                              </div>
                            )}
                            {banned && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold ${banned ? "text-slate-400 line-through" : "text-slate-900"}`}>
                              {u.name ?? "—"}
                            </p>
                            <p className="text-xs text-slate-400 sm:hidden">{u.email}</p>
                            {banned && u.banReason && (
                              <p className="text-xs text-red-400 mt-0.5 max-w-[180px] truncate">{u.banReason}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 hidden sm:table-cell">
                        {u.email ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {banned ? (
                          <div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                              {isPermanent ? "Daimi blok" : "Bloklanmış"}
                            </span>
                            {!isPermanent && u.bannedUntil && (
                              <p className="text-[10px] text-slate-400 mt-1">
                                {new Date(u.bannedUntil).toLocaleDateString("az-AZ", { day: "numeric", month: "short" })} qədər
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            u.role === "admin"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {u.role === "admin" ? "Admin" : "Donor"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right hidden md:table-cell">
                        {u.donationCount > 0 ? (
                          <div>
                            <p className="font-semibold text-emerald-600">
                              {parseFloat(u.donationTotal).toLocaleString("az-AZ")} ₼
                            </p>
                            <p className="text-xs text-slate-400">{u.donationCount} ianə</p>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-400 text-xs hidden lg:table-cell">
                        <p>{new Date(u.createdAt).toLocaleDateString("az-AZ", {
                          day: "numeric", month: "short", year: "numeric",
                        })}</p>
                        <p className="text-slate-300">{new Date(u.createdAt).toLocaleTimeString("az-AZ", {
                          hour: "2-digit", minute: "2-digit",
                        })}</p>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {u.role !== "admin" && (
                          banned ? (
                            <button
                              type="button"
                              onClick={() => handleUnban(u)}
                              className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                            >
                              Bloku aç
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setBanTarget(u)}
                              className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              Blokla
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
