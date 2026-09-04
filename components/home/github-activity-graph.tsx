"use client";

import type { ReactNode } from "react";

import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  type Activity,
} from "@/components/vritti/contribution-graph";
import { cn } from "@/lib/utils";

const LEVEL_FILL = [
  'data-[level="0"]:fill-foreground/8 dark:data-[level="0"]:fill-foreground/10',
  'data-[level="1"]:fill-emerald-200 dark:data-[level="1"]:fill-emerald-950',
  'data-[level="2"]:fill-emerald-300 dark:data-[level="2"]:fill-emerald-800',
  'data-[level="3"]:fill-emerald-500 dark:data-[level="3"]:fill-emerald-600',
  'data-[level="4"]:fill-emerald-700 dark:data-[level="4"]:fill-emerald-400',
].join(" ");

/**
 * The vritti ContributionGraph primitives use a render-prop API (children
 * as a function), which only works between client components — a function
 * can't cross the server->client boundary as a prop. This wrapper takes
 * the already-fetched, plain-serializable `activities` data from the
 * server component and does all the render-prop wiring client-side.
 */
export function GitHubActivityGraph({
  activities,
}: {
  activities: Activity[];
}): ReactNode {
  return (
    <ContributionGraph
      data={activities}
      blockSize={11}
      blockMargin={3}
      blockRadius={2}
      fontSize={11}
      className="text-foreground/40 gap-3"
    >
      {/* dir="rtl" makes the scroll container rest scrolled to the right by
          default (today, the newest week) instead of the left (a year ago)
          — the SVG's own x/y coordinates are fixed pixel values, so they're
          unaffected by the direction flip. */}
      <ContributionGraphCalendar dir="rtl">
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
            className={cn(LEVEL_FILL)}
          >
            <title>
              {activity.count} contribution{activity.count === 1 ? "" : "s"} on{" "}
              {activity.date}
            </title>
          </ContributionGraphBlock>
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter>
        <ContributionGraphLegend>
          {({ level }) => (
            <svg height={11} width={11}>
              <title>{`${level} contributions`}</title>
              <rect
                className={cn("stroke-border stroke-[1px]", LEVEL_FILL)}
                data-level={level}
                height={11}
                rx={2}
                ry={2}
                width={11}
              />
            </svg>
          )}
        </ContributionGraphLegend>
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}
