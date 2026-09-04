"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faMobileScreen,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card, Carousel } from "@/components/vritti/apple-cards-carousel";
import type { Project } from "./projects-data";

function ProjectCoverMedia({ project }: { project: Project }): ReactNode {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={project.imageAlt ?? project.name}
        fill
        sizes="(min-width: 640px) 288px, 208px"
        className="object-cover"
      />
    );
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: project.gradient }}
    >
      {project.logo ? (
        <span className="relative h-16 w-16 sm:h-20 sm:w-20">
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

function ProjectDetail({ project }: { project: Project }): ReactNode {
  return (
    <div className="text-foreground/70 mx-auto flex max-w-2xl flex-col gap-6 text-[15px] leading-relaxed sm:text-[16px]">
      <p className="text-foreground text-[17px] font-medium tracking-tight sm:text-[19px]">
        {project.headline}
      </p>
      <p>{project.description}</p>

      {project.techStack?.length ? (
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="border-foreground/10 text-foreground/70 rounded-full border px-3 py-1 text-xs font-medium tracking-tight"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}

      <p className="text-foreground/50 text-[13px] tracking-tight">
        {project.meta}
        <span className="text-foreground/30 mx-2">&bull;</span>
        {project.language}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {project.githubUrl ? (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring border-foreground/10 text-foreground hover:bg-foreground/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
          >
            <FontAwesomeIcon
              icon={faGithub}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            GitHub
          </Link>
        ) : null}
        {project.liveUrl ? (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring border-foreground/10 text-foreground hover:bg-foreground/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Live site
          </Link>
        ) : null}
        {project.playStoreUrl ? (
          <Link
            href={project.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring border-foreground/10 text-foreground hover:bg-foreground/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
          >
            <FontAwesomeIcon
              icon={faMobileScreen}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Play Store
          </Link>
        ) : null}
        {project.dribbbleUrl ? (
          <Link
            href={project.dribbbleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring border-foreground/10 text-foreground hover:bg-foreground/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
          >
            <FontAwesomeIcon
              icon={faPalette}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Dribbble
          </Link>
        ) : null}
        <Link
          href={`/projects/${project.id}`}
          className="focus-ring bg-foreground text-background inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          View full case study
        </Link>
      </div>
    </div>
  );
}

export function ProjectCarousel({
  projects,
}: {
  projects: Project[];
}): ReactNode {
  const items = projects.map((project, index) => (
    <Card
      key={project.id}
      index={index}
      card={{
        category: project.category,
        title: project.iconLabel,
        media: <ProjectCoverMedia project={project} />,
        content: <ProjectDetail project={project} />,
        footer: (
          <p className="text-[13px] tracking-tight text-white/70">
            {project.meta}
            <span className="mx-2 text-white/30">&bull;</span>
            {project.language}
          </p>
        ),
      }}
    />
  ));

  return <Carousel items={items} />;
}
