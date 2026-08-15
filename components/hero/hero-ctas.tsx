"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroCtas(): ReactNode {
  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.55, ease: EASE } }}
        className="mt-2 flex flex-wrap items-center gap-3"
      >
        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: EASE } }}
        >
          <a
            href="/nitheesh-rajendran-resume.pdf"
            download
            className="focus-ring inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-[13px] font-medium text-background"
          >
            <FontAwesomeIcon icon={faDownload} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Download Resume
          </a>
        </motion.div>

        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: EASE } }}
        >
          <Link
            href="/projects"
            className="border border-foreground/5 focus-ring group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-background px-4 text-[13px] font-medium text-foreground shadow-2xl transition-colors hover:bg-foreground/4"
          >
            View My Work
            <FontAwesomeIcon
              icon={faArrowRight}
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
