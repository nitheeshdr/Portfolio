import { ContactCard } from "@/components/contact/contact-card";
import { Projects } from "@/components/projects/projects";
import { OpenSourceContributions } from "@/components/shared/open-source-contributions";
import {
  JsonLd,
  breadcrumbSchema,
  projectsSchema,
} from "@/components/seo/json-ld";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata } from "@/lib/metadata";
import { getAllProjects } from "@/lib/projects-db";
import { getOpenSourceProjects } from "@/lib/open-source";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Projects",
  description:
    "SaaS platforms, AI products, and mobile apps built by Nitheesh Rajendran — CodeForge AI, PulseCommerce, Community Finance, and more.",
  path: "/projects",
});

export default async function ProjectsPage(): Promise<ReactNode> {
  const [dbProjects, openSourceProjects] = await Promise.all([
    getAllProjects(),
    getOpenSourceProjects(),
  ]);
  const projects = [...dbProjects, ...openSourceProjects];

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <JsonLd
        items={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
          projectsSchema(
            projects.map((p) => ({
              name: p.name,
              description: p.description,
              url:
                p.liveUrl ??
                p.githubUrl ??
                p.playStoreUrl ??
                p.dribbbleUrl ??
                "",
              ...(p.githubUrl ? { codeRepository: p.githubUrl } : {}),
              programmingLanguage: p.language,
              ...(p.kind ? { kind: p.kind } : {}),
            }))
          ),
        ]}
      />
      <section className="mx-auto w-full max-w-275 px-6 pt-12 pb-16 sm:px-10 sm:pt-16 sm:pb-20 md:pt-28">
        <FadeIn className="flex flex-col items-center gap-5 text-center">
          <h1 className="text-foreground font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[3.25rem] lg:text-[3.75rem]">
            My recent work
          </h1>
          <p className="text-foreground/65 max-w-[33ch] text-[20px] leading-[1.4] tracking-tight sm:text-[22px]">
            SaaS platforms, AI products, and mobile apps &mdash; built end to
            end and shipped to production.
          </p>
        </FadeIn>
      </section>
      <Projects projects={dbProjects} showFilters />
      <div className="pt-4 pb-16 sm:pb-20">
        <OpenSourceContributions withHeadline />
      </div>
      <ContactCard />
    </main>
  );
}

export const revalidate = 60;
