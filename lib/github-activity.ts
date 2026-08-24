import { person } from "@/lib/person";

export type ContributionDay = {
  date: string;
  /** GitHub's own 0–4 intensity bucket for this day. */
  level: number;
  count: number;
};

export type ContributionCalendar = {
  totalContributions: number;
  days: ContributionDay[];
};

const USERNAME = person.links.github.split("/").filter(Boolean).pop()!;

/**
 * GitHub doesn't expose a public REST/GraphQL endpoint for the contribution
 * calendar without an authenticated token, but the profile page itself
 * renders one server-side at this URL and ships it as a plain HTML fragment
 * (used by github.com's own async-loaded profile widget). Parsing that
 * avoids needing a token or any server-side credentials at all — same
 * technique used by most third-party "contribution graph" embeds.
 */
export async function getContributionCalendar(): Promise<ContributionCalendar | null> {
  let html: string;
  try {
    const res = await fetch(
      `https://github.com/users/${USERNAME}/contributions`,
      {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "nitheeshdr.in" },
      }
    );
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  const tooltips = new Map<string, string>();
  const tooltipPattern =
    /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;
  for (const match of html.matchAll(tooltipPattern)) {
    tooltips.set(match[1]!, match[2]!.trim());
  }

  const days: ContributionDay[] = [];
  const cellPattern = /<td[^>]*class="ContributionCalendar-day"[^>]*>/g;
  for (const cellMatch of html.matchAll(cellPattern)) {
    const cell = cellMatch[0];
    const date = /data-date="([^"]+)"/.exec(cell)?.[1];
    const level = /data-level="([^"]+)"/.exec(cell)?.[1];
    const id = /id="([^"]+)"/.exec(cell)?.[1];
    if (!date || level === undefined) continue;

    const tooltipText = id ? tooltips.get(id) : undefined;
    const countMatch = tooltipText ? /^(\d+)/.exec(tooltipText) : null;

    days.push({
      date,
      level: Number(level),
      count: countMatch ? Number(countMatch[1]) : 0,
    });
  }

  if (!days.length) return null;

  return {
    totalContributions: days.reduce((sum, d) => sum + d.count, 0),
    days,
  };
}
