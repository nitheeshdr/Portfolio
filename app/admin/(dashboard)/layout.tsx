import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <div className="bg-background flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden px-8 py-8">{children}</div>
    </div>
  );
}

export const dynamic = "force-dynamic";
