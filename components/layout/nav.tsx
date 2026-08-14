"use client";

import {
  FolderKanban,
  Github,
  Home as HomeIcon,
  Mail,
  Moon,
  Share2,
  Sun,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { Dock, DockIcon } from "@/components/ui/dock";
import { person } from "@/lib/person";

type NavItem = {
  label: string;
  href: string;
  icon?: typeof HomeIcon;
  avatar?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "About", href: "/about", avatar: true },
];

const SOCIAL_LINKS = [
  {
    label: "Email",
    href: `mailto:${person.email}`,
    lucideIcon: Mail,
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
    lucideIcon: Github,
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
    lucideIcon: Youtube,
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

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function NavThemeToggle(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const next = isDark ? "light" : "dark";

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsViewTransitions =
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function";

    if (!supportsViewTransitions || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-cx", `${cx}px`);
    root.style.setProperty("--theme-cy", `${cy}px`);
    root.style.setProperty("--theme-r", `${radius}px`);
    root.dataset.themeAnim = "1";

    const transition = document.startViewTransition(() => {
      setTheme(next);
    });

    transition.finished.finally(() => {
      delete root.dataset.themeAnim;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      className="focus-ring text-foreground/70 hover:text-foreground relative flex h-full w-full cursor-pointer items-center justify-center rounded-full transition-colors"
    >
      <span aria-hidden="true" className="relative h-[45%] w-[45%]">
        <Sun
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            mounted && isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            mounted && !isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
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
      <Share2
        className="h-[45%] w-[45%]"
        strokeWidth={2.25}
        aria-hidden="true"
      />
    </button>
  );
}

function SocialLinkButton({
  href,
  label,
  lucideIcon: LucideIcon,
  imageSrc,
  bg,
  light,
}: {
  href: string;
  label: string;
  lucideIcon?: typeof Mail;
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
      {LucideIcon ? (
        <LucideIcon className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
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

function useCompactOnScroll(): boolean {
  const [compact, setCompact] = useState(false);
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
          setCompact(false);
        } else if (delta > SCROLL_DELTA_THRESHOLD) {
          setCompact(true);
        } else if (delta < -SCROLL_DELTA_THRESHOLD) {
          setCompact(false);
        }

        lastY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return compact;
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const [socialsOpen, setSocialsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const compact = useCompactOnScroll();

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

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <motion.div
        animate={{
          scale: compact ? 0.78 : 1,
          opacity: compact ? 0.88 : 1,
        }}
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
                          isActive ? "ring-foreground/25" : "ring-foreground/10"
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
                      <Icon
                        className="h-[45%] w-[45%]"
                        strokeWidth={2.25}
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
          <DockIcon disableMagnification>
            <IconTooltip label="Theme">
              <NavThemeToggle />
            </IconTooltip>
          </DockIcon>
      </Dock>
      </motion.div>

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
