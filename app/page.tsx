import { AboutTeaser } from "@/components/about/about-teaser";
import { Stack } from "@/components/about/stack";
import { ContactCard } from "@/components/contact/contact-card";
import { GitHubActivity } from "@/components/home/github-activity";
import { HomePreloader } from "@/components/home/home-preloader";
import { Hero } from "@/components/hero/hero";
import { MyApps } from "@/components/apps/my-apps";
import { Projects } from "@/components/projects/projects";
import { OpenSourceContributions } from "@/components/shared/open-source-contributions";
import { WebStoriesTeaser } from "@/components/home/web-stories-teaser";
import { JsonLd, myAppsSchema, profilePageSchema } from "@/components/seo/json-ld";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { getMyApps, isMyApp } from "@/lib/my-apps";
import { getAllProjects, getProjectUpdateDates } from "@/lib/projects-db";
import { person } from "@/lib/person";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  description: siteConfig.description,
  path: "/",
  image: person.portraitSrc,
  profile: true,
});

export default async function HomePage(): Promise<ReactNode> {
  const [projects, apps, updatedAt] = await Promise.all([
    getAllProjects(),
    getMyApps(),
    getProjectUpdateDates(),
  ]);
  // Real last-modified time of the site's content: the newest project edit.
  const lastModified = [...updatedAt.values()].reduce<Date | undefined>(
    (latest, date) => (!latest || date > latest ? date : latest),
    undefined
  );

  return (
    <HomePreloader>
      <main id="main-content" className="flex flex-1 flex-col gap-10 sm:gap-14">
        <JsonLd
          items={[
            profilePageSchema("/", {
              ...(lastModified ? { dateModified: lastModified } : {}),
            }),
            ...(apps.length
              ? [
                  myAppsSchema(
                    apps.map((a) => ({
                      id: a.id,
                      name: a.name,
                      description: a.description,
                    }))
                  ),
                ]
              : []),
          ]}
        />
        <Hero />
        <AboutTeaser />
        <GitHubActivity />
        <Projects projects={projects.filter((p) => !isMyApp(p))} withHeadline viewMoreVisible />
        <MyApps withHeadline />
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
