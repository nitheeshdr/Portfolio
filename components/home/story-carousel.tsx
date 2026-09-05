"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { Card, Carousel } from "@/components/vritti/apple-cards-carousel";
import { ShareButton } from "@/components/shared/share-button";
import { createStoryShareUrl } from "@/lib/instagram-story-share";
import type { WebStory } from "@/lib/web-stories";

function StoryCoverMedia({ story }: { story: WebStory }): ReactNode {
  return (
    <Image
      src={story.posterImage}
      alt={story.title}
      fill
      sizes="(min-width: 640px) 288px, 208px"
      className="object-cover"
    />
  );
}

function StoryDetail({ story }: { story: WebStory }): ReactNode {
  return (
    <div className="text-foreground/70 mx-auto flex max-w-2xl flex-col gap-6 text-[15px] leading-relaxed sm:text-[16px]">
      <p className="text-foreground/50 text-[13px] tracking-tight">
        {story.pages.length} page{story.pages.length === 1 ? "" : "s"}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`/stories/${story.slug}`}
          className="focus-ring bg-foreground text-background inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          Watch story
        </a>
        <ShareButton
          type="story"
          data={{
            slug: story.slug,
            title: story.title,
            image: story.posterImage,
            url: createStoryShareUrl(`/stories/${story.slug}`),
          }}
        />
      </div>
    </div>
  );
}

export function StoryCarousel({ stories }: { stories: WebStory[] }): ReactNode {
  const items = stories.map((story, index) => (
    <Card
      key={story.id}
      index={index}
      card={{
        category: "Web Story",
        title: story.title,
        media: <StoryCoverMedia story={story} />,
        content: <StoryDetail story={story} />,
      }}
    />
  ));

  return <Carousel items={items} />;
}
