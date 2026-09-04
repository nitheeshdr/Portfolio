"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodePullRequest, faStar } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card, Carousel } from "@/components/vritti/apple-cards-carousel";
import { openSourceProjectId, type OpenSourceRepo } from "@/lib/open-source";

function RepoCoverMedia({ repo }: { repo: OpenSourceRepo }): ReactNode {
  return (
    <Image
      src={repo.avatarUrl}
      alt=""
      fill
      sizes="(min-width: 640px) 288px, 208px"
      className="object-cover"
    />
  );
}

function RepoDetail({ repo }: { repo: OpenSourceRepo }): ReactNode {
  return (
    <div className="text-foreground/70 mx-auto flex max-w-2xl flex-col gap-6 text-[15px] leading-relaxed sm:text-[16px]">
      {repo.description ? <p>{repo.description}</p> : null}

      {repo.pullRequests.length ? (
        <div className="flex flex-col gap-2">
          {repo.pullRequests.map((pr) => (
            <Link
              key={pr.number}
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group text-foreground/70 hover:text-foreground flex items-start gap-2 rounded-lg text-[14px] leading-snug tracking-tight transition-colors"
            >
              <FontAwesomeIcon
                icon={faCodePullRequest}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500"
                aria-hidden="true"
              />
              <span className="group-hover:underline">
                {pr.title}
                <span className="text-foreground/40"> #{pr.number}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      <p className="text-foreground/50 flex items-center gap-3 text-[13px] tracking-tight">
        {repo.language ? <span>{repo.language}</span> : null}
        <span className="flex items-center gap-1">
          <FontAwesomeIcon
            icon={faStar}
            className="h-3 w-3"
            aria-hidden="true"
          />
          {repo.stars.toLocaleString()}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={repo.url}
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
        <Link
          href={`/projects/${openSourceProjectId(repo.owner, repo.name)}`}
          className="focus-ring bg-foreground text-background inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          View full case study
        </Link>
      </div>
    </div>
  );
}

export function OpenSourceCarousel({
  repos,
}: {
  repos: OpenSourceRepo[];
}): ReactNode {
  const items = repos.map((repo, index) => (
    <Card
      key={`${repo.owner}/${repo.name}`}
      index={index}
      card={{
        category: repo.language ?? "Open source",
        title: `${repo.owner}/${repo.name}`,
        media: <RepoCoverMedia repo={repo} />,
        content: <RepoDetail repo={repo} />,
        footer: (
          <p className="flex items-center gap-3 text-[13px] tracking-tight text-white/70">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon
                icon={faStar}
                className="h-3 w-3"
                aria-hidden="true"
              />
              {repo.stars.toLocaleString()}
            </span>
            <span>
              {repo.pullRequests.length} merged PR
              {repo.pullRequests.length === 1 ? "" : "s"}
            </span>
          </p>
        ),
      }}
    />
  ));

  return <Carousel items={items} />;
}
