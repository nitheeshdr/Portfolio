"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { Carousel } from "@/components/vritti/apple-cards-carousel";

/** Store screenshots in the same snap-scroll carousel (arrows, edge-to-edge) used for the project cards. */
export function ScreenshotCarousel({
  screenshots,
  name,
}: {
  screenshots: string[];
  name: string;
}): ReactNode {
  const items = screenshots.map((src, index) => (
    <div
      key={src}
      className="ring-foreground/5 bg-foreground/5 relative aspect-[554/1200] h-[26rem] overflow-hidden rounded-3xl ring-1 sm:h-[30rem]"
    >
      <Image
        src={src}
        alt={`${name} screenshot ${index + 1} of ${screenshots.length}`}
        fill
        sizes="(min-width: 640px) 222px, 192px"
        className="object-cover"
        priority={index < 3}
      />
    </div>
  ));

  return <Carousel items={items} />;
}
