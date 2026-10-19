import type { ReactNode } from "react";

import { ProjectCarousel } from "@/components/projects/project-carousel";
import { FadeIn } from "@/components/ui/motion-primitives";
import { getMyApps } from "@/lib/my-apps";

export async function MyApps({
  withHeadline = false,
}: {
  withHeadline?: boolean;
}): Promise<ReactNode> {
  const apps = await getMyApps();
  if (!apps.length) return null;

  return (
    <section id="my-apps" className="relative w-full scroll-mt-24">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-start gap-3 pb-8 text-left sm:pb-10">
            <h2 className="text-foreground font-serif text-[1.75rem] leading-[1.1] font-medium tracking-tight sm:text-[2.25rem]">
              My apps
            </h2>
            <p className="text-foreground/65 max-w-[42ch] text-[16px] leading-[1.45] tracking-tight sm:text-[17px]">
              Mobile apps I designed, built, and published on the Play Store.
            </p>
          </FadeIn>
        ) : (
          <h3 className="text-foreground mb-4 text-[15px] font-semibold tracking-tight">
            My apps
          </h3>
        )}
      </div>

      <ProjectCarousel projects={apps} />
    </section>
  );
}
