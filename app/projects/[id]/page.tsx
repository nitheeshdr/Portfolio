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
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { ProjectMedia } from "@/components/projects/projects";
import {
  JsonLd,
  breadcrumbSchema,
  projectDetailSchema,
} from "@/components/seo/json-ld";
import { ShareButton } from "@/components/shared/share-button";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createStoryShareUrl } from "@/lib/instagram-story-share";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { getAllProjects, getProjectById } from "@/lib/projects-db";
import { getOpenSourceProjects, getOwnGithubProjects } from "@/lib/open-source";

type Params = { id: string };

export async function generateStaticParams(): Promise<Params[]> {
  const dbProjects = await getAllProjects();
  const [openSourceProjects, ownGithubProjects] = await Promise.all([
    getOpenSourceProjects(),
    getOwnGithubProjects(
      dbProjects
        .map((p) => p.githubUrl)
        .filter((url): url is string => Boolean(url))
    ),
  ]);
  return [...dbProjects, ...openSourceProjects, ...ownGithubProjects].map(
    (project) => ({
      id: project.id,
    })
  );
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
    keywords: [
      project.name,
      ...(project.packageName ? [project.packageName] : []),
      ...(project.keywords ?? []),
      ...(project.techStack ?? []),
    ],
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
    project.playStoreUrl ??
    project.githubUrl ??
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
            ...(project.liveUrl ? { liveUrl: project.liveUrl } : {}),
            ...(project.playStoreUrl
              ? { playStoreUrl: project.playStoreUrl }
              : {}),
            ...(project.downloadUrl
              ? { downloadUrl: project.downloadUrl }
              : {}),
            ...(project.pullRequests?.length ? { isContribution: true } : {}),
            ...(project.packageName
              ? { packageName: project.packageName }
              : {}),
            ...(project.screenshots?.length
              ? { screenshots: project.screenshots }
              : {}),
            ...(project.softwareVersion
              ? { softwareVersion: project.softwareVersion }
              : {}),
            ...(project.permissions?.length
              ? { permissions: project.permissions }
              : {}),
            ...(project.keywords?.length ? { keywords: project.keywords } : {}),
            ...(project.faqs?.length ? { faqs: project.faqs } : {}),
            ...(project.contentRating
              ? { contentRating: project.contentRating }
              : {}),
            ...(project.lastUpdated
              ? { lastUpdated: project.lastUpdated }
              : {}),
            ...(project.downloads ? { downloads: project.downloads } : {}),
            ...(project.rating ? { rating: project.rating } : {}),
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
                {project.packageName ? (
                  <>
                    <span className="text-foreground/30 mx-2">&bull;</span>
                    <code className="text-[13px]">{project.packageName}</code>
                  </>
                ) : null}
              </span>
              <h1 className="text-foreground font-serif text-[2.25rem] leading-[1.05] font-medium tracking-tight sm:text-[3rem] lg:text-[3.5rem]">
                {project.name}
              </h1>
              <p className="text-foreground/65 max-w-[56ch] text-[18px] leading-[1.5] tracking-tight sm:text-[20px]">
                {project.headline}
              </p>
              <ShareButton
                type="project"
                data={{
                  slug: project.id,
                  title: project.name,
                  description: project.description,
                  image: project.image,
                  tags: project.techStack,
                  url: createStoryShareUrl(`/projects/${project.id}`),
                }}
              />
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

      {project.screenshots?.length ? (
        <section
          aria-label={`${project.name} screenshots`}
          className="mx-auto mt-10 w-full max-w-275 px-6 sm:px-10"
        >
          <h2 className="text-foreground mb-4 text-[15px] font-semibold tracking-tight">
            Screenshots
          </h2>
          <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 sm:-mx-10 sm:px-10">
            {project.screenshots.map((src, index) => (
              <li
                key={src}
                className="ring-foreground/5 bg-foreground/5 relative aspect-[554/1200] h-[26rem] shrink-0 snap-start overflow-hidden rounded-2xl ring-1 sm:h-[32rem]"
              >
                <Image
                  src={src}
                  alt={`${project.name} screenshot ${index + 1}`}
                  fill
                  sizes="(min-width: 640px) 240px, 200px"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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

          {project.packageName ? (
            <div className="mt-12 flex flex-col gap-3">
              <h2 className="text-foreground text-[15px] font-semibold tracking-tight">
                App details
              </h2>
              <dl className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 grid gap-x-8 gap-y-4 rounded-4xl border p-6 text-[14px] tracking-tight sm:grid-cols-2 sm:text-[15px]">
                <div>
                  <dt className="text-foreground/50">Package name</dt>
                  <dd className="text-foreground mt-1 break-all font-mono text-[13px] sm:text-[14px]">
                    {project.packageName}
                  </dd>
                </div>
                {project.operatingSystem ? (
                  <div>
                    <dt className="text-foreground/50">Platform</dt>
                    <dd className="text-foreground mt-1">
                      {project.operatingSystem}
                    </dd>
                  </div>
                ) : null}
                {project.applicationCategory ? (
                  <div>
                    <dt className="text-foreground/50">Category</dt>
                    <dd className="text-foreground mt-1">
                      {project.applicationCategory.replace(/Application$/, "")}
                    </dd>
                  </div>
                ) : null}
                {project.softwareVersion ? (
                  <div>
                    <dt className="text-foreground/50">Version</dt>
                    <dd className="text-foreground mt-1">
                      {project.softwareVersion}
                    </dd>
                  </div>
                ) : null}
                {project.downloads ? (
                  <div>
                    <dt className="text-foreground/50">Downloads</dt>
                    <dd className="text-foreground mt-1">
                      {project.downloads.toLocaleString("en-IN")}+
                    </dd>
                  </div>
                ) : null}
                {project.contentRating ? (
                  <div>
                    <dt className="text-foreground/50">Content rating</dt>
                    <dd className="text-foreground mt-1">
                      {project.contentRating}
                    </dd>
                  </div>
                ) : null}
                {project.lastUpdated ? (
                  <div>
                    <dt className="text-foreground/50">Last updated</dt>
                    <dd className="text-foreground mt-1">
                      <time dateTime={project.lastUpdated}>
                        {new Date(project.lastUpdated).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </time>
                    </dd>
                  </div>
                ) : null}
                {project.rating ? (
                  <div>
                    <dt className="text-foreground/50">Google Play rating</dt>
                    <dd className="text-foreground mt-1">
                      {project.rating.value.toFixed(1)} / 5 (
                      {project.rating.count.toLocaleString("en-IN")} ratings)
                    </dd>
                  </div>
                ) : null}
                {project.permissions?.length ? (
                  <div className="sm:col-span-2">
                    <dt className="text-foreground/50">Permissions</dt>
                    <dd className="text-foreground mt-1">
                      {project.permissions.join(" · ")}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {project.faqs?.length ? (
            <div className="mt-12 flex flex-col gap-3">
              <h2 className="text-foreground text-[15px] font-semibold tracking-tight">
                Frequently asked questions
              </h2>
              <div className="flex flex-col gap-2.5">
                {project.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 group rounded-2xl border px-4 py-3"
                  >
                    <summary className="text-foreground cursor-pointer text-[15px] font-medium tracking-tight">
                      {faq.question}
                    </summary>
                    <p className="text-foreground/70 mt-2 text-[14px] leading-[1.6] tracking-tight sm:text-[15px]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ) : null}
        </FadeIn>
      </section>

      <ContactCard />
    </main>
  );
}

export const revalidate = 60;
