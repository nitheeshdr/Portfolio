import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata } from "@/lib/metadata";
import { getPublishedStories } from "@/lib/web-stories";

export const metadata: Metadata = createMetadata({
  title: "Web Stories",
  description: "Short, swipeable visual stories.",
  path: "/stories",
});

export default async function StoriesPage(): Promise<ReactNode> {
  const stories = await getPublishedStories();

  return (
    <main id="main-content" className="w-full">
      <div className="mx-auto w-full max-w-275 px-6 py-16 sm:px-10 sm:py-20">
        <FadeIn className="flex flex-col items-start gap-3 pb-10 text-left">
          <h1 className="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem]">
            Web Stories
          </h1>
          <p className="text-foreground/65 max-w-[42ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]">
            Short, swipeable visual stories.
          </p>
        </FadeIn>

        {stories.length === 0 ? (
          <p className="text-foreground/50 text-[14px] tracking-tight">
            No stories published yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {stories.map((story) => (
              <a
                key={story.id}
                href={`/stories/${story.slug}`}
                className="focus-ring group relative aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={story.posterImage}
                  alt={story.title}
                  fill
                  sizes="(min-width: 768px) 25vw, 45vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="line-clamp-2 text-[13px] font-medium tracking-tight text-white">
                    {story.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export const revalidate = 60;
