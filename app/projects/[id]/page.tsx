import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { ProjectMedia } from "@/components/projects/projects";
import { PROJECTS } from "@/components/projects/projects-data";
import {
  JsonLd,
  breadcrumbSchema,
  projectDetailSchema,
} from "@/components/seo/json-ld";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata, siteConfig } from "@/lib/metadata";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return PROJECTS.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return {};

  return createMetadata({
    title: project.name,
    description: project.description,
    path: `/projects/${project.id}`,
    ...(project.image ? { image: project.image } : {}),
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}): Promise<ReactNode> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) notFound();

  const primaryUrl = project.liveUrl ?? project.githubUrl;

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <JsonLd
        items={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.name, path: `/projects/${project.id}` },
          ]),
          ...projectDetailSchema({
            name: project.name,
            description: project.description,
            url: primaryUrl,
            pageUrl: `${siteConfig.url}/projects/${project.id}`,
            codeRepository: project.githubUrl,
            programmingLanguage: project.language,
            applicationCategory: project.applicationCategory,
            operatingSystem: project.operatingSystem,
            ...(project.techStack ? { techStack: project.techStack } : {}),
            ...(project.features ? { features: project.features } : {}),
            ...(project.image ? { image: project.image } : {}),
          }),
        ]}
      />

      <section className="mx-auto w-full max-w-275 px-6 pt-12 pb-16 sm:px-10 sm:pt-16 sm:pb-20 md:pt-28">
        <FadeIn>
          <Link
            href="/projects"
            className="focus-ring text-foreground/60 hover:text-foreground group mb-8 inline-flex items-center gap-1.5 text-sm font-medium tracking-tight transition-colors"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All projects
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-foreground/50 text-sm tracking-tight">
                {project.meta}
                <span className="text-foreground/30 mx-2">&bull;</span>
                {project.language}
              </span>
              <h1 className="font-serif text-[2.25rem] font-medium leading-[1.05] tracking-tight text-foreground sm:text-[3rem] lg:text-[3.5rem]">
                {project.name}
              </h1>
              <p className="max-w-[56ch] text-[18px] leading-[1.5] tracking-tight text-foreground/65 sm:text-[20px]">
                {project.headline}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring border-foreground/8 group inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View code
              </Link>
              {project.liveUrl ? (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors"
                >
                  Visit site
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ) : null}
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <FadeIn delay={0.1}>
          <ProjectMedia project={project} />
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-275 px-6 py-16 sm:px-10 sm:py-20">
        <FadeIn delay={0.15}>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-6">
              <p className="text-[16px] leading-[1.7] tracking-tight text-foreground/75 sm:text-[17px]">
                {project.description}
              </p>

              {project.features?.length ? (
                <div className="flex flex-col gap-3">
                  <h2 className="text-foreground text-[15px] font-semibold tracking-tight">
                    What it does
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 rounded-2xl border px-4 py-3 text-[14px] leading-normal tracking-tight text-foreground/75 sm:text-[15px]"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {project.techStack?.length ? (
              <div className="flex flex-col gap-3">
                <h2 className="text-foreground text-[15px] font-semibold tracking-tight">
                  Built with
                </h2>
                <div className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 flex flex-wrap gap-2 rounded-4xl border p-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-foreground/8 bg-background px-3.5 py-1.5 text-[13px] tracking-tight text-foreground/85 sm:text-[14px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </FadeIn>
      </section>

      <ContactCard />
      <div className="h-20 sm:h-24" />
    </main>
  );
}
