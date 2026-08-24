import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faAward } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";

export function AboutTeaser(): ReactNode {
  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <FadeIn>
          <div className="border-foreground/8 bg-background flex flex-col items-start gap-6 rounded-4xl border p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <div className="flex max-w-[64ch] flex-col gap-3">
              <Link
                href="/about#awards"
                className="focus-ring border-foreground/10 bg-foreground/3 hover:bg-foreground/6 text-foreground/80 inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium tracking-tight transition-colors"
              >
                <FontAwesomeIcon
                  icon={faAward}
                  className="h-3.5 w-3.5 text-amber-500"
                  aria-hidden="true"
                />
                Recognized by StartupTN for responsible security disclosure
              </Link>
              <p className="text-foreground/70 text-[17px] leading-[1.55] tracking-tight sm:text-[18px]">
                <span className="text-foreground font-medium">
                  Nitheesh Rajendran
                </span>{" "}
                is the Founder &amp; CEO of{" "}
                <span className="text-foreground font-medium">
                  Setups Works
                </span>
                , a digital agency specializing in web development, design,
                branding, and digital marketing. He is also a software developer
                and Indian filmmaker known for combining technology with
                creative storytelling.
              </p>
            </div>

            <Link
              href="/about"
              className="focus-ring group border-foreground/8 bg-background text-foreground hover:bg-foreground/5 inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors sm:self-center"
            >
              More about me
              <FontAwesomeIcon
                icon={faArrowRight}
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
