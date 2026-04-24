"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePatientButton({ patientId }: { patientId: number }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function doDelete() {
    setLoading(true);
    const secret = typeof window !== "undefined"
      ? (localStorage.getItem("admin_secret") ?? "")
      : "";
    const res = await fetch(`/api/patients/${patientId}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });
    if (res.ok) {
      router.push("/dashboard/patients");
      router.refresh();
    } else {
      alert("Silmə zamanı xəta baş verdi");
      setLoading(false);
      setConfirm(false);
    }
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="w-full mt-3 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 py-2 rounded-xl transition-all font-medium"
      >
        Müraciəti sil
      </button>
    );
  }

  return (
    <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-red-700 text-center">
        Əminsiniz? Bu əməliyyat geri alına bilməz.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setConfirm(false)}
          className="flex-1 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Ləğv et
        </button>
        <button
          onClick={doDelete}
          disabled={loading}
          className="flex-1 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg transition-colors"
        >
          {loading ? "Silinir..." : "Bəli, sil"}
        </button>
      </div>
    </div>
  );
}
