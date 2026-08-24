import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodePullRequest, faStar } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import {
  getOpenSourceContributions,
  openSourceProjectId,
} from "@/lib/open-source";

export async function OpenSourceContributions({
  withHeadline = false,
}: {
  withHeadline?: boolean;
}): Promise<ReactNode> {
  const repos = await getOpenSourceContributions();
  if (!repos.length) return null;

  return (
    <section
      id="open-source-contributions"
      className="relative w-full scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-3 pb-8 text-center sm:pb-10">
            <h2 className="text-foreground font-serif text-[1.75rem] leading-[1.1] font-medium tracking-tight sm:text-[2.25rem]">
              Open source contributions
            </h2>
            <p className="text-foreground/65 max-w-[42ch] text-[16px] leading-[1.45] tracking-tight sm:text-[17px]">
              Merged pull requests in other people&rsquo;s projects.
            </p>
          </FadeIn>
        ) : (
          <h3 className="text-foreground mb-4 text-[15px] font-semibold tracking-tight">
            Open source contributions
          </h3>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {repos.map((repo, index) => (
            <FadeIn
              key={`${repo.owner}/${repo.name}`}
              delay={Math.min(index * 0.06, 0.3)}
            >
              <article className="border-foreground/8 bg-background flex flex-col gap-4 rounded-3xl border p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2.5">
                  <Link
                    href={`/projects/${openSourceProjectId(repo.owner, repo.name)}`}
                    className="focus-ring flex min-w-0 items-center gap-2.5 rounded-lg"
                  >
                    <span className="border-foreground/10 relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                      <Image
                        src={repo.avatarUrl}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>
                    <span className="text-foreground truncate text-sm font-medium tracking-tight hover:underline">
                      {repo.owner}/{repo.name}
                    </span>
                  </Link>
                  <Link
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${repo.owner}/${repo.name} on GitHub`}
                    className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground bg-background inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faGithub}
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {repo.description ? (
                  <Link
                    href={`/projects/${openSourceProjectId(repo.owner, repo.name)}`}
                    className="focus-ring text-foreground/65 hover:text-foreground rounded-lg text-[14px] leading-normal tracking-tight transition-colors sm:text-[15px]"
                  >
                    {repo.description}
                  </Link>
                ) : null}

                <div className="flex flex-col gap-1.5">
                  {repo.pullRequests.map((pr) => (
                    <Link
                      key={pr.number}
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring group text-foreground/70 hover:text-foreground flex items-start gap-2 rounded-lg text-[13px] leading-snug tracking-tight transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faCodePullRequest}
                        className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500"
                        aria-hidden="true"
                      />
                      <span className="group-hover:underline">
                        {pr.title}
                        <span className="text-foreground/40">
                          {" "}
                          #{pr.number}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>

                <p className="text-foreground/50 flex items-center gap-3 text-[12px] tracking-tight">
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
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
