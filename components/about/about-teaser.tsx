import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";

export function AboutTeaser(): ReactNode {
  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <FadeIn>
          <div className="flex flex-col items-start gap-6 rounded-4xl border border-foreground/8 bg-background p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <p className="max-w-[64ch] text-[17px] leading-[1.55] tracking-tight text-foreground/70 sm:text-[18px]">
              <span className="font-medium text-foreground">
                Nitheesh Rajendran
              </span>{" "}
              is the Founder &amp; CEO of{" "}
              <span className="font-medium text-foreground">
                Setups Works
              </span>
              , a digital agency specializing in web development, design,
              branding, and digital marketing. He is also a software
              developer and Indian filmmaker known for combining technology
              with creative storytelling.
            </p>

            <Link
              href="/about"
              className="focus-ring group inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-xl border border-foreground/8 bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 sm:self-center"
            >
              More about me
              <ArrowRight
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
