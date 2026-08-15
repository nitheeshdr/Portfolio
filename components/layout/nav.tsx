"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faFolderTree,
  faHouse,
  faNewspaper,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Dock, DockIcon } from "@/components/ui/dock";
import { person } from "@/lib/person";

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
];

const SOCIAL_LINKS = [
  {
    label: "Email",
    href: `mailto:${person.email}`,
    faIcon: faEnvelope,
    bg: "#525252",
  },
  {
    label: "LinkedIn",
    href: person.links.linkedin,
    imageSrc: "/linkedin.svg",
    bg: "#0A66C2",
  },
  {
    label: "GitHub",
    href: person.links.github,
    faIcon: faGithub,
    bg: "#181717",
  },
  {
    label: "Instagram",
    href: person.links.instagram,
    imageSrc: "/icons/instagram.svg",
    bg: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
  },
  {
    label: "YouTube",
    href: person.links.youtube,
    faIcon: faYoutube,
    bg: "#FF0000",
  },
  {
    label: "IMDb",
    href: person.links.imdb,
    imageSrc: "/icons/imdb.svg",
    bg: "#F5C518",
    light: true,
  },
] as const;

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

function ProfileDockIcon({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}): ReactNode {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Hide social links" : "Show social links"}
      aria-expanded={open}
      className={`focus-ring flex h-full w-full cursor-pointer items-center justify-center rounded-full transition-colors ${
        open
          ? "bg-foreground/10 text-foreground"
          : "text-foreground/60 hover:text-foreground"
      }`}
    >
      <FontAwesomeIcon
        icon={faShareNodes}
        className="h-[45%] w-[45%]"
        aria-hidden="true"
      />
    </button>
  );
}

function SocialLinkButton({
  href,
  label,
  faIcon,
  imageSrc,
  bg,
  light,
}: {
  href: string;
  label: string;
  faIcon?: IconDefinition;
  imageSrc?: string;
  bg: string;
  light?: boolean;
}): ReactNode {
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      aria-label={label}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ background: bg }}
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-110"
    >
      {faIcon ? (
        <FontAwesomeIcon icon={faIcon} className="h-4 w-4" aria-hidden="true" />
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
          className={`max-h-4 max-w-4 object-contain ${light ? "" : "brightness-0 invert"}`}
        />
      ) : null}
    </Link>
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
  const [socialsOpen, setSocialsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navState = useNavScrollState(true);
  const compact = navState !== "full";

  const currentNavItem =
    NAV_ITEMS.find((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) ?? NAV_ITEMS[0]!;

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setSocialsOpen(false);
  }

  useEffect(() => {
    if (!socialsOpen) return;

    const handlePointerDown = (e: PointerEvent): void => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setSocialsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setSocialsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [socialsOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      ref={navRef}
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
              <DockIcon>
                <IconTooltip label="Social links">
                  <ProfileDockIcon
                    open={socialsOpen}
                    onToggle={() => setSocialsOpen((v) => !v)}
                  />
                </IconTooltip>
              </DockIcon>
            </Dock>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {socialsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="border-foreground/8 bg-background absolute bottom-full left-1/2 mb-3 flex -translate-x-1/2 items-center gap-2 rounded-full border p-2 shadow-sm"
          >
            {SOCIAL_LINKS.map((link) => (
              <SocialLinkButton key={link.label} {...link} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
