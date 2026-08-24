import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faCodePullRequest,
  faMobileScreen,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { ProjectMedia } from "@/components/projects/projects";
import type { Project } from "@/components/projects/projects-data";
import {
  JsonLd,
  breadcrumbSchema,
  projectDetailSchema,
} from "@/components/seo/json-ld";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { getAllProjects, getProjectBySlug } from "@/lib/projects-db";
import {
  getOpenSourceProjects,
  OPEN_SOURCE_ID_PREFIX,
} from "@/lib/open-source";

type Params = { id: string };

/**
 * Open-source entries aren't in MongoDB — they're fetched live from GitHub
 * (see lib/open-source.ts) — so a miss on the DB lookup falls back to the
 * live-generated list before giving up. The id prefix lets us skip that
 * live fetch entirely for the (overwhelmingly common) DB-project case.
 */
async function getProjectById(id: string): Promise<Project | null> {
  const dbProject = await getProjectBySlug(id);
  if (dbProject) return dbProject;
  if (!id.startsWith(OPEN_SOURCE_ID_PREFIX)) return null;

  const openSourceProjects = await getOpenSourceProjects();
  return openSourceProjects.find((p) => p.id === id) ?? null;
}

export async function generateStaticParams(): Promise<Params[]> {
  const [dbProjects, openSourceProjects] = await Promise.all([
    getAllProjects(),
    getOpenSourceProjects(),
  ]);
  return [...dbProjects, ...openSourceProjects].map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
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
  const project = await getProjectById(id);
  if (!project) notFound();

  const primaryUrl =
    project.liveUrl ??
    project.githubUrl ??
    project.playStoreUrl ??
    project.dribbbleUrl ??
    "";

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
            ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
            programmingLanguage: project.language,
            ...(project.kind ? { kind: project.kind } : {}),
            ...(project.applicationCategory
              ? { applicationCategory: project.applicationCategory }
              : {}),
            ...(project.operatingSystem
              ? { operatingSystem: project.operatingSystem }
              : {}),
            ...(project.techStack ? { techStack: project.techStack } : {}),
            ...(project.features ? { features: project.features } : {}),
            ...(project.pullRequests?.length
              ? {
                  features: project.pullRequests.map(
                    (pr) => `${pr.title} (#${pr.number})`
                  ),
                }
              : {}),
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
            <FontAwesomeIcon
              icon={faArrowLeft}
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
              <h1 className="text-foreground font-serif text-[2.25rem] leading-[1.05] font-medium tracking-tight sm:text-[3rem] lg:text-[3.5rem]">
                {project.name}
              </h1>
              <p className="text-foreground/65 max-w-[56ch] text-[18px] leading-[1.5] tracking-tight sm:text-[20px]">
                {project.headline}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {project.githubUrl ? (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring border-foreground/8 group bg-background text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  View code
                </Link>
              ) : null}
              {project.playStoreUrl ? (
                <Link
                  href={project.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring border-foreground/8 group bg-background text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <FontAwesomeIcon
                    icon={faMobileScreen}
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Get it on Google Play
                </Link>
              ) : null}
              {project.liveUrl ? (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group bg-foreground text-background inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  Visit site
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ) : null}
              {project.dribbbleUrl ? (
                <Link
                  href={project.dribbbleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group bg-foreground text-background inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  <FontAwesomeIcon
                    icon={faPalette}
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  View on Dribbble
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
              <p className="text-foreground/75 text-[16px] leading-[1.7] tracking-tight sm:text-[17px]">
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
                        className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 text-foreground/75 rounded-2xl border px-4 py-3 text-[14px] leading-normal tracking-tight sm:text-[15px]"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {project.pullRequests?.length ? (
                <div className="flex flex-col gap-3">
                  <h2 className="text-foreground text-[15px] font-semibold tracking-tight">
                    Merged pull requests
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {project.pullRequests.map((pr) => (
                      <li key={pr.number}>
                        <Link
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring group border-foreground/5 bg-foreground/2 dark:bg-foreground/5 hover:bg-foreground/5 dark:hover:bg-foreground/10 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[14px] leading-normal tracking-tight transition-colors sm:text-[15px]"
                        >
                          <FontAwesomeIcon
                            icon={faCodePullRequest}
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500"
                            aria-hidden="true"
                          />
                          <span className="text-foreground/75 group-hover:text-foreground min-w-0 break-words">
                            {pr.title}
                            <span className="text-foreground/40">
                              {" "}
                              #{pr.number}
                            </span>
                          </span>
                        </Link>
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
                      className="border-foreground/8 bg-background text-foreground/85 rounded-full border px-3.5 py-1.5 text-[13px] tracking-tight sm:text-[14px]"
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
    </main>
  );
}

export const revalidate = 60;
