import { AboutTeaser } from "@/components/about/about-teaser";
import { Stack } from "@/components/about/stack";
import { ContactCard } from "@/components/contact/contact-card";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { JsonLd, profilePageSchema } from "@/components/seo/json-ld";
import { createMetadata, siteConfig } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  description: siteConfig.description,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-20 sm:gap-28">
      <JsonLd items={[profilePageSchema("/")]} />
      <Hero />
      <AboutTeaser />
      <Projects withHeadline viewMoreVisible />
      <section className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <Stack />
      </section>
      <ContactCard />
      <div className="h-28 sm:h-32" />
    </main>
  );
}
