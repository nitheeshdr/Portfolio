"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Nav } from "@/components/layout/nav";
import { PageBackdrop } from "@/components/layout/page-backdrop";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Decorative/marketing-site chrome — the ambient backdrop, corner frame, and
 * nav dock. Skipped on /admin: PageBackdrop is an absolutely positioned 900px
 * element that otherwise inflates the scrollable height of short admin pages
 * even though it's visually offscreen.
 */
export function SiteChrome(): ReactNode {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div className="site-frame site-frame--top" aria-hidden="true" />
      <div className="site-frame site-frame--left" aria-hidden="true" />
      <div className="site-frame site-frame--right" aria-hidden="true" />
      <svg className="site-corner site-corner--top-left" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z" fill="currentColor"/>
      </svg>
      <svg className="site-corner site-corner--top-right" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z" fill="currentColor"/>
      </svg>
      <PageBackdrop />
      <ThemeToggle />
      <Nav />
    </>
  );
}
