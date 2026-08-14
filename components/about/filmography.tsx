import { Clapperboard, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { person } from "@/lib/person";

export function Filmography(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        Filmography
      </h3>
      <div className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 flex flex-col gap-2 rounded-4xl border p-2 sm:p-4">
        {person.filmography.map((film) => (
          <Link
            key={film.title}
            href={film.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring bg-background border-foreground/5 hover:border-foreground/10 group flex items-start gap-4 rounded-3xl border p-3 transition-colors"
          >
            <span
              className="border-foreground/15 inline-flex h-12 w-12 shrink-0 items-center justify-center border bg-white dark:bg-neutral-900"
              aria-hidden="true"
              style={{ borderRadius: 14 }}
            >
              <Clapperboard
                className="h-5 w-5 text-foreground/60"
                strokeWidth={2}
              />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-foreground inline-flex items-center gap-1.5 text-[17px] font-semibold tracking-tight sm:text-[18px]">
                {film.title}
                <ExternalLink
                  className="h-3.5 w-3.5 text-foreground/35 transition-colors group-hover:text-foreground/60"
                  aria-hidden="true"
                />
              </span>
              <span className="text-foreground/65 text-[14px] tracking-tight sm:text-[15px]">
                {film.role}
                <span className="text-foreground/30 mx-2">•</span>
                <span className="text-foreground/55">
                  {film.format}
                  {"year" in film && film.year ? ` · ${film.year}` : ""}
                </span>
              </span>
              <p className="text-foreground/60 mt-1 text-[13px] leading-normal tracking-tight sm:text-[14px]">
                {film.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
