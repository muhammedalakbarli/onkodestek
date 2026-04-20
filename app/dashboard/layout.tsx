"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin  = pathname === "/dashboard/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      {/* Mobil: pt-14 (üst bar yüksəkliyi), Desktop: ml-56 */}
      <div className="flex-1 min-h-screen overflow-auto pt-14 lg:pt-0 lg:ml-56">
        {children}
      </div>
    </div>
  );
}
