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
      <div className="ml-56 flex-1 min-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
}
