import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { OpenSourceCarousel } from "@/components/shared/open-source-carousel";
import { getOwnGithubRepos } from "@/lib/open-source";

export async function GithubRepos({
  excludeUrls,
  withHeadline = false,
}: {
  /** GitHub URLs already shown as full project case studies — kept out of this list so nothing repeats. */
  excludeUrls: string[];
  withHeadline?: boolean;
}): Promise<ReactNode> {
  const repos = await getOwnGithubRepos(excludeUrls);
  if (!repos.length) return null;

  return (
    <section id="github-repos" className="relative w-full scroll-mt-24">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-start gap-3 pb-8 text-left sm:pb-10">
            <h2 className="text-foreground font-serif text-[1.75rem] leading-[1.1] font-medium tracking-tight sm:text-[2.25rem]">
              More on GitHub
            </h2>
            <p className="text-foreground/65 max-w-[42ch] text-[16px] leading-[1.45] tracking-tight sm:text-[17px]">
              Other public repositories, straight from the profile.
            </p>
          </FadeIn>
        ) : (
          <h3 className="text-foreground mb-4 text-[15px] font-semibold tracking-tight">
            More on GitHub
          </h3>
        )}
      </div>

      <OpenSourceCarousel repos={repos} />
    </section>
  );
}
