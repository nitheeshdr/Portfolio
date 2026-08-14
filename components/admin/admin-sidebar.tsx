"use client";

import { FolderKanban, LayoutDashboard, LogOut, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
] as const;

export function AdminSidebar(): ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="border-foreground/8 bg-background flex w-56 shrink-0 flex-col border-r px-4 py-6">
      <div className="mb-6 px-2">
        <span className="text-foreground text-[15px] font-semibold tracking-tight">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const isActive =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`focus-ring flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] font-medium tracking-tight transition-colors ${
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="focus-ring text-foreground/60 hover:text-foreground hover:bg-foreground/5 flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] font-medium tracking-tight transition-colors disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
        {loggingOut ? "Signing out..." : "Sign out"}
      </button>
    </aside>
  );
}
