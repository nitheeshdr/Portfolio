import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { PolaroidFlashcards } from "@/components/about/polaroid-strip";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";

export function Hero(): ReactNode {
  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 pt-6 pb-4 sm:px-10 sm:pt-8 sm:pb-6">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8">
          <FadeIn className="flex flex-col gap-4">
            <p className="text-[20px] leading-tight tracking-tight font-medium text-foreground">
              Hey
              <span aria-hidden="true" className="mx-0.5">
                👋
              </span>
              , I&rsquo;m Nitheesh Rajendran
            </p>

            <h1 className="text-[2.1rem] font-medium leading-[1.1] tracking-tight text-foreground sm:text-[2.75rem] sm:leading-[1.05] md:text-[2.5rem] lg:text-[3.65rem]">
              <span className="block sm:whitespace-nowrap">
                Full-stack engineer &
              </span>
              <span className="block sm:whitespace-nowrap">AI product builder</span>
            </h1>

            <p className="max-w-[36ch] text-[22px] leading-[1.4] tracking-tight text-foreground/65">
              Founder of Setups Works, building AI-powered SaaS platforms and
              production software end to end.
            </p>

            <HeroCtas />
          </FadeIn>

          <ScaleUnblur className="flex justify-center md:justify-end">
            <PolaroidFlashcards className="w-full sm:max-w-sm" />
          </ScaleUnblur>
        </div>
      </div>
    </section>
  );
}
