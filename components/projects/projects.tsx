"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faMobileScreen,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion-primitives";
import {
  PROJECT_CATEGORIES,
  SCREENSHOT_RATIO,
  type Project,
  type ProjectCategory,
} from "./projects-data";

const FILTERS = ["All", ...PROJECT_CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

export type ProjectsProps = {
  projects: Project[];
  withHeadline?: boolean;
  viewMoreVisible?: boolean;
  showFilters?: boolean;
};

export function Projects({
  projects,
  withHeadline = false,
  viewMoreVisible = false,
  showFilters = false,
}: ProjectsProps): ReactNode {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === (filter as ProjectCategory));
  const items = viewMoreVisible ? filtered.slice(0, 4) : filtered;

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
            <h2 className="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]">
              My projects
            </h2>
            <p className="text-foreground/65 max-w-[36ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]">
              SaaS platforms, AI products, and mobile apps &mdash; each one
              shipped end to end, code on GitHub.
            </p>
          </FadeIn>
        ) : null}

        {showFilters ? (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`focus-ring cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium tracking-tight transition-colors ${
                  filter === f
                    ? "border-foreground/10 bg-foreground text-background"
                    : "border-foreground/8 bg-background text-foreground/65 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
            {/* Open-source contributions are live-fetched from GitHub, not part of
                `projects`, so this isn't a real filter — it just scrolls to the
                dedicated section below instead of touching `filter` state. */}
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("open-source-contributions")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="focus-ring border-foreground/8 bg-background text-foreground/65 hover:text-foreground cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium tracking-tight transition-colors"
            >
              Open Source
            </button>
          </div>
        ) : null}

        <div className="columns-1 gap-6 md:columns-2 md:gap-7">
          {items.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {viewMoreVisible ? (
          <div className="mt-12 flex justify-center sm:mt-16">
            <Link
              href="/projects"
              className="border-foreground/8 focus-ring group bg-background text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              View all projects
              <FontAwesomeIcon
                icon={faArrowRight}
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ProjectMedia({ project }: { project: Project }): ReactNode {
  if (project.image) {
    return (
      <div
        className="project-card__image ring-foreground/5 bg-foreground/5 relative w-full overflow-hidden rounded-2xl ring-1"
        style={{ aspectRatio: SCREENSHOT_RATIO }}
      >
        <div className="project-card__image-inner">
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.name}
            fill
            sizes="(min-width: 1024px) 540px, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="ring-foreground/5 relative flex w-full items-center justify-center overflow-hidden rounded-2xl ring-1"
      style={{ aspectRatio: SCREENSHOT_RATIO, background: project.gradient }}
    >
      {project.logo ? (
        <span className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
          <Image
            src={project.logo}
            alt=""
            fill
            sizes="80px"
            className="object-contain"
          />
        </span>
      ) : (
        <span className="text-[15px] font-medium tracking-tight text-white/90">
          {project.name}
        </span>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}): ReactNode {
  const detailHref = `/projects/${project.id}`;

  return (
    <FadeIn
      delay={Math.min(index * 0.06, 0.3)}
      className="mb-6 break-inside-avoid md:mb-7"
    >
      <article className="project-card border-foreground/8 bg-background flex flex-col gap-4 rounded-3xl border p-3 sm:p-3.5">
        <header className="flex items-center justify-between gap-2.5 px-1 pt-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="border-foreground/10 bg-background text-foreground relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border text-[11px] font-semibold">
              {project.logo ? (
                <Image
                  src={project.logo}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                project.name.charAt(0)
              )}
            </span>
            <span className="text-foreground truncate text-sm font-medium tracking-tight">
              {project.iconLabel}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {project.githubUrl ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on GitHub`}
                className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground bg-background inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
              >
                <FontAwesomeIcon
                  icon={faGithub}
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </Link>
            ) : null}
            {project.playStoreUrl ? (
              <Link
                href={project.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on Google Play`}
                className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground bg-background inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
              >
                <FontAwesomeIcon
                  icon={faMobileScreen}
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </Link>
            ) : null}
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.name}`}
                className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground bg-background inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
              >
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </Link>
            ) : null}
            {project.dribbbleUrl ? (
              <Link
                href={project.dribbbleUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on Dribbble`}
                className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground bg-background inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
              >
                <FontAwesomeIcon
                  icon={faPalette}
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </Link>
            ) : null}
          </div>
        </header>

        <Link href={detailHref} className="focus-ring rounded-2xl">
          <ProjectMedia project={project} />
        </Link>

        <Link
          href={detailHref}
          className="focus-ring flex flex-col gap-2.5 rounded-2xl px-1 pb-1"
        >
          <h3 className="text-foreground text-[20px] leading-[1.2] font-medium tracking-tight sm:text-[22px]">
            {project.headline}
          </h3>
          <p className="text-foreground/65 text-[14px] leading-normal tracking-tight sm:text-[15px]">
            {project.description}
          </p>
        </Link>

        <p className="text-foreground/50 px-1 pb-2 text-[12px] tracking-tight">
          {project.meta}
          <span className="text-foreground/30 mx-2">&bull;</span>
          {project.language}
        </p>
      </article>
    </FadeIn>
  );
}
