import type { ReactNode } from "react";

import { StoryCarousel } from "@/components/home/story-carousel";
import { FadeIn } from "@/components/ui/motion-primitives";
import { getPublishedStories } from "@/lib/web-stories";

/**
 * A minimal on-site entry point for Web Stories — Google's own guidance is
 * that stories should be "linked from your site" for discoverability, on
 * top of the sitemap entry. Reuses the same Apple Cards Carousel as the
 * Projects/Open Source sections; its "Watch story" link is a plain `<a>`,
 * not `next/link`, since each destination is a standalone AMP document
 * outside the React app and should always be a full navigation.
 */
export async function WebStoriesTeaser(): Promise<ReactNode> {
  const stories = await getPublishedStories();
  if (!stories.length) return null;

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <FadeIn className="flex flex-col items-start gap-3 pb-6 text-left">
          <h2 className="text-foreground font-serif text-[1.75rem] leading-[1.1] font-medium tracking-tight sm:text-[2.25rem]">
            Web Stories
          </h2>
          <p className="text-foreground/65 max-w-[42ch] text-[16px] leading-[1.45] tracking-tight sm:text-[17px]">
            Short, swipeable visual stories.
          </p>
        </FadeIn>
      </div>

      <StoryCarousel stories={stories} />
    </section>
  );
}
