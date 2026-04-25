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
  donationCount: number;
  donationTotal: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const totalDonors = users.filter((u) => u.donationCount > 0).length;
  const totalDonated = users.reduce((s, u) => s + parseFloat(u.donationTotal), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">İstifadəçilər</h1>
        <p className="text-slate-500 text-sm mt-1">
          Platformaya qeydiyyatdan keçmiş bütün istifadəçilər
        </p>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-slate-900">{users.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Ümumi istifadəçi</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-emerald-700">{totalDonors}</p>
          <p className="text-xs text-slate-500 mt-0.5">İanə edən</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-2xl font-extrabold text-blue-700">
            {totalDonated.toLocaleString("az-AZ")} ₼
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Ümumi ianə</p>
        </div>
      </div>

      {/* Axtarış */}
      <div className="mb-4 relative">
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
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rol</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">İanələr</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Qoşulma tarixi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <Image
                            src={u.image}
                            alt=""
                            width={36}
                            height={36}
                            className="rounded-full shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                            {u.name?.[0]?.toUpperCase() ?? u.email?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{u.name ?? "—"}</p>
                          <p className="text-xs text-slate-400 sm:hidden">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 hidden sm:table-cell">
                      {u.email ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.role === "admin"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {u.role === "admin" ? "Admin" : "Donor"}
                      </span>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
