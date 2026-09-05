import { AboutTeaser } from "@/components/about/about-teaser";
import { Stack } from "@/components/about/stack";
import { ContactCard } from "@/components/contact/contact-card";
import { GitHubActivity } from "@/components/home/github-activity";
import { HomePreloader } from "@/components/home/home-preloader";
import { Hero } from "@/components/hero/hero";
import { Projects } from "@/components/projects/projects";
import { OpenSourceContributions } from "@/components/shared/open-source-contributions";
import { WebStoriesTeaser } from "@/components/home/web-stories-teaser";
import { JsonLd, profilePageSchema } from "@/components/seo/json-ld";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { getAllProjects } from "@/lib/projects-db";
import { person } from "@/lib/person";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  description: siteConfig.description,
  path: "/",
  image: person.portraitSrc,
});

export default async function HomePage(): Promise<ReactNode> {
  const projects = await getAllProjects();

  return (
    <HomePreloader>
      <main id="main-content" className="flex flex-1 flex-col gap-10 sm:gap-14">
        <JsonLd items={[profilePageSchema("/")]} />
        <Hero />
        <AboutTeaser />
        <GitHubActivity />
        <Projects projects={projects} withHeadline viewMoreVisible />
        <OpenSourceContributions withHeadline />
        <WebStoriesTeaser />
        <section className="mx-auto w-full max-w-275 px-6 sm:px-10">
          <Stack />
        </section>
        <ContactCard />
      </main>
    </HomePreloader>
  );
}

export const revalidate = 60;
