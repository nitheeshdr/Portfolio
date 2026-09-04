import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import type { ReactNode } from "react";

import { GitHubActivityGraph } from "@/components/home/github-activity-graph";
import { FadeIn } from "@/components/ui/motion-primitives";
import type { Activity } from "@/components/vritti/contribution-graph";
import { getContributionCalendar } from "@/lib/github-activity";
import { person } from "@/lib/person";

export async function GitHubActivity(): Promise<ReactNode> {
  const calendar = await getContributionCalendar();
  if (!calendar) return null;

  const activities: Activity[] = calendar.days;
  const username = person.links.github.split("/").filter(Boolean).pop();

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <FadeIn>
          <div className="border-foreground/8 bg-background rounded-4xl border p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon
                  icon={faGithub}
                  className="text-foreground/50 h-4 w-4"
                  aria-hidden="true"
                />
                <span className="text-foreground text-[15px] font-semibold tracking-tight">
                  {calendar.totalContributions.toLocaleString()} contributions
                  in the last year
                </span>
              </div>
              <a
                href={person.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring text-foreground/50 hover:text-foreground text-[13px] font-medium tracking-tight transition-colors"
              >
                @{username} on GitHub
              </a>
            </div>

            <GitHubActivityGraph activities={activities} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
