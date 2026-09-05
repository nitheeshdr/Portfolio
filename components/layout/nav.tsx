"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFolderTree,
  faHouse,
  faImages,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Dock, DockIcon } from "@/components/ui/dock";

type NavItem = {
  label: string;
  href: string;
  icon?: IconDefinition;
  avatar?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/", icon: faHouse },
  { label: "Projects", href: "/projects", icon: faFolderTree },
  { label: "About", href: "/about", avatar: true },
  { label: "Blog", href: "/blog", icon: faNewspaper },
  { label: "Stories", href: "/stories", icon: faImages },
];

function IconTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="group relative flex h-full w-full items-center justify-center">
      {children}
      <span
        role="tooltip"
        className="border-foreground/8 bg-background text-foreground pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 rounded-lg border px-2.5 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}

const SCROLL_DELTA_THRESHOLD = 6;
const SCROLL_TOP_THRESHOLD = 80;
const ICON_ONLY_THRESHOLD = 500;

type NavScrollState = "full" | "compact" | "icon";

/**
 * Full size near the top; a slightly smaller/faded dock once scrolled down;
 * and — only when `iconOnly` is enabled (the home page) — collapses all the
 * way to a single icon after a deep scroll down. Any upward scroll restores
 * the full dock immediately, without needing to reach the top.
 */
function useNavScrollState(iconOnly: boolean): NavScrollState {
  const [state, setState] = useState<NavScrollState>("full");
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY.current;

        if (currentY < SCROLL_TOP_THRESHOLD) {
          setState("full");
        } else if (delta > SCROLL_DELTA_THRESHOLD) {
          setState(
            iconOnly && currentY > ICON_ONLY_THRESHOLD ? "icon" : "compact"
          );
        } else if (delta < -SCROLL_DELTA_THRESHOLD) {
          setState("full");
        }

        lastY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [iconOnly]);

  return state;
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const navState = useNavScrollState(true);
  const compact = navState !== "full";

  const currentNavItem =
    NAV_ITEMS.find((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) ?? NAV_ITEMS[0]!;

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <AnimatePresence mode="wait" initial={false}>
        {navState === "icon" ? (
          <motion.button
            key="icon-pill"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={`Back to top — ${currentNavItem.label}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="border-foreground/8 bg-background focus-ring flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 shadow-sm"
          >
            {currentNavItem.avatar ? (
              <div className="ring-foreground/10 relative h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1">
                <Image
                  src="/avatar.jpg"
                  alt=""
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>
            ) : currentNavItem.icon ? (
              <FontAwesomeIcon
                icon={currentNavItem.icon}
                className="text-foreground h-4 w-4"
                aria-hidden="true"
              />
            ) : null}
            <span className="text-foreground text-sm font-medium tracking-tight">
              {currentNavItem.label}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="dock"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: compact ? 0.88 : 1,
              scale: compact ? 0.78 : 1,
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          >
            <Dock iconSize={48} iconMagnification={68} iconDistance={120}>
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <DockIcon key={item.href}>
                    <IconTooltip label={item.label}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={item.label}
                        className={`focus-ring flex h-full w-full items-center justify-center rounded-full transition-colors ${
                          isActive
                            ? "bg-foreground/10 text-foreground"
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        {item.avatar ? (
                          <div
                            className={`relative h-[70%] w-[70%] overflow-hidden rounded-full ring-1 ${
                              isActive
                                ? "ring-foreground/25"
                                : "ring-foreground/10"
                            }`}
                          >
                            <Image
                              src="/avatar.jpg"
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ) : Icon ? (
                          <FontAwesomeIcon
                            icon={Icon}
                            className="h-[45%] w-[45%]"
                            aria-hidden="true"
                          />
                        ) : null}
                      </Link>
                    </IconTooltip>
                  </DockIcon>
                );
              })}
            </Dock>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
