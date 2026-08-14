import type { ReactNode } from "react";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage(): ReactNode {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}

export const dynamic = "force-dynamic";
