"use client";

import { Home, RotateCcw, FolderKanban } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { DottedPattern } from "@/components/ui/dotted-pattern";

const JOKES = [
  "This page ran out of runway and got acquired by 404-land.",
  "console.error(\"page not found\") — and nobody caught the exception.",
  "Somewhere, a routing table is very confused right now.",
  "This URL returned undefined. Classic.",
  "Even the AI mentor couldn't find this one.",
  "404: page compiling since forever.",
];

const DIGIT_TRANSITION = {
  duration: 3.2,
  repeat: Infinity,
  ease: [0.45, 0, 0.55, 1],
} as const;

export default function NotFound(): ReactNode {
  const [jokeIndex, setJokeIndex] = useState(0);

  return (
    <main
      id="main-content"
      className="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-32 text-center sm:pt-20"
    >
      <FloatingTiles />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none relative flex select-none items-center justify-center font-serif text-[7rem] leading-none font-medium tracking-tight text-foreground sm:text-[10rem] lg:text-[13rem]"
      >
        <motion.span
          animate={{ rotate: [0, -6, 5, -3, 0], y: [0, -6, 4, -2, 0] }}
          transition={DIGIT_TRANSITION}
          className="inline-block"
        >
          4
        </motion.span>
        <motion.span
          animate={{ rotate: [0, 10, -10, 6, 0], scale: [1, 1.08, 0.94, 1.03, 1] }}
          transition={{ ...DIGIT_TRANSITION, duration: 2.6 }}
          className="mx-1 inline-block text-foreground/15"
        >
          0
        </motion.span>
        <motion.span
          animate={{ rotate: [0, 6, -5, 3, 0], y: [0, 5, -4, 2, 0] }}
          transition={{ ...DIGIT_TRANSITION, duration: 3.6 }}
          className="inline-block"
        >
          4
        </motion.span>
      </motion.div>

      <h1 className="sr-only">Page not found</h1>

      <p className="relative mt-6 max-w-[34ch] text-[19px] leading-[1.4] tracking-tight text-foreground/65 sm:text-[22px]">
        This page doesn&rsquo;t exist &mdash; or it got refactored into
        oblivion.
      </p>

      <div className="relative mt-4 flex min-h-[3.5rem] items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={jokeIndex}
            initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(6px)", y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[40ch] text-[14px] tracking-tight text-foreground/45 sm:text-[15px]"
          >
            {JOKES[jokeIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => setJokeIndex((v) => (v + 1) % JOKES.length)}
        className="focus-ring relative mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-foreground/50 transition-colors hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Another one
      </button>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition-transform hover:scale-105"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Take me home
        </Link>
        <Link
          href="/projects"
          className="focus-ring border-foreground/8 inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          <FolderKanban className="h-4 w-4" aria-hidden="true" />
          See projects instead
        </Link>
      </div>
    </main>
  );
}

const TILE_LAYOUT = [
  { top: "12%", left: "8%", size: 46, rotate: -12, duration: 7 },
  { top: "18%", left: "82%", size: 34, rotate: 18, duration: 9 },
  { top: "72%", left: "12%", size: 28, rotate: 8, duration: 8 },
  { top: "68%", left: "86%", size: 42, rotate: -16, duration: 6.5 },
  { top: "40%", left: "4%", size: 20, rotate: 24, duration: 10 },
  { top: "38%", left: "92%", size: 24, rotate: -20, duration: 7.5 },
] as const;

function FloatingTiles(): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden sm:block"
    >
      {TILE_LAYOUT.map((tile, i) => (
        <motion.div
          key={i}
          className="border-foreground/8 bg-foreground/2 dark:bg-foreground/5 absolute overflow-hidden rounded-2xl border"
          style={{
            top: tile.top,
            left: tile.left,
            width: tile.size,
            height: tile.size,
          }}
          animate={{
            y: [0, -14, 0],
            rotate: [tile.rotate, tile.rotate + 10, tile.rotate],
          }}
          transition={{
            duration: tile.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <DottedPattern size={8} className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}
