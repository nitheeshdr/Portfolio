import { ContactCard } from "@/components/contact/contact-card";
import { PROJECTS } from "@/components/projects/projects-data";
import { Projects } from "@/components/projects/projects";
import { JsonLd, breadcrumbSchema, projectsSchema } from "@/components/seo/json-ld";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Projects",
  description:
    "SaaS platforms, AI products, and mobile apps built by Nitheesh Rajendran — CodeForge AI, PulseCommerce, Community Finance, and more.",
  path: "/projects",
});

export default function ProjectsPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <JsonLd
        items={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
          projectsSchema(
            PROJECTS.map((p) => ({
              name: p.name,
              description: p.description,
              url: p.liveUrl ?? p.githubUrl ?? p.playStoreUrl ?? "",
              ...(p.githubUrl ? { codeRepository: p.githubUrl } : {}),
              programmingLanguage: p.language,
            }))
          ),
        ]}
      />
      <section className="mx-auto w-full max-w-275 px-6 pt-12 pb-16 sm:px-10 sm:pt-16 sm:pb-20 md:pt-28">
        <FadeIn className="flex flex-col items-center gap-5 text-center">
          <h1 className="font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3.25rem] lg:text-[3.75rem]">
            My recent work
          </h1>
          <p className="max-w-[33ch] text-[20px] leading-[1.4] tracking-tight text-foreground/65 sm:text-[22px]">
            SaaS platforms, AI products, and mobile apps &mdash; built end to end and shipped to production.
          </p>
        </FadeIn>
      </section>
      <Projects showFilters />
      <ContactCard />
    </main>
  );
}
