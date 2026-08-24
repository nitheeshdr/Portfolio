import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import {
  getContributionCalendar,
  type ContributionDay,
} from "@/lib/github-activity";
import { person } from "@/lib/person";

const LEVEL_CLASSES = [
  "bg-foreground/8 dark:bg-foreground/10",
  "bg-emerald-200 dark:bg-emerald-950",
  "bg-emerald-300 dark:bg-emerald-800",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-emerald-700 dark:bg-emerald-400",
];

/** Buckets a flat, date-sorted day list into GitHub-style Sunday-start weeks (columns). */
function buildWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  if (!days.length) return [];
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: (ContributionDay | null)[][] = [];
  let week: (ContributionDay | null)[] = [];

  for (const day of sorted) {
    const dayOfWeek = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (dayOfWeek === 0 && week.length) {
      weeks.push(week);
      week = [];
    }
    if (week.length === 0 && dayOfWeek > 0) {
      week = new Array(dayOfWeek).fill(null);
    }
    week.push(day);
  }
  if (week.length) weeks.push(week);
  return weeks;
}

export async function GitHubActivity(): Promise<ReactNode> {
  const calendar = await getContributionCalendar();
  if (!calendar) return null;

  const weeks = buildWeeks(calendar.days);
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

            {/* dir="rtl" on the scroll container makes it rest scrolled to the
                right by default (today, the newest week) instead of the left
                (a year ago) — dir="ltr" on the inner grid keeps the weeks
                themselves reading oldest-to-newest as normal. */}
            <div dir="rtl" className="overflow-x-auto pb-1">
              <div dir="ltr" className="inline-flex gap-[3px]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const day = week[dayIndex] ?? null;
                      return (
                        <div
                          key={dayIndex}
                          title={
                            day
                              ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`
                              : undefined
                          }
                          className={`h-[11px] w-[11px] rounded-[2px] ${
                            day
                              ? (LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0])
                              : "bg-transparent"
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
