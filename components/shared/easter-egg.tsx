"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { person } from "@/lib/person";

const TRIGGER = "nithee";
const AUTO_DISMISS_MS = 6000;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Type "nithee" anywhere on the site to reveal this. A tiny signature
 * moment for anyone curious (or bored) enough to type the founder's name.
 */
export function EasterEgg(): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement | null;
      const isTypingField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTypingField || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;

      buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer === TRIGGER) {
        buffer = "";
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const dismissTimer = window.setTimeout(() => setIsOpen(false), AUTO_DISMISS_MS);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(dismissTimer);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`I am ${person.name}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="border-foreground/10 bg-background relative flex w-full max-w-sm flex-col items-center gap-4 rounded-4xl border p-8 text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
              className="border-foreground/10 relative h-20 w-20 overflow-hidden rounded-full border"
            >
              <Image
                src={person.portraitSrc}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </motion.div>

            <div className="flex flex-col gap-1.5">
              <p className="text-foreground/50 text-[13px] tracking-tight">
                Hey, you found it —
              </p>
              <h2 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
                I am {person.name}
              </h2>
              <p className="text-foreground/60 max-w-[26ch] text-[14px] tracking-tight">
                {person.tagline.join(" ")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="focus-ring bg-foreground text-background mt-1 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium"
            >
              Nice to meet you
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
