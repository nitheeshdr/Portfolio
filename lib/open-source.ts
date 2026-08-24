import type { Project } from "@/components/projects/projects-data";
import { person } from "@/lib/person";

/** id prefix for open-source entries mapped into the shared Project shape — used to route /projects/[id] and to tell these apart from DB-backed projects. */
export const OPEN_SOURCE_ID_PREFIX = "opensource-";

export function openSourceProjectId(owner: string, name: string): string {
  return `${OPEN_SOURCE_ID_PREFIX}${owner}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
}

export type OpenSourcePullRequest = {
  title: string;
  url: string;
  number: number;
  mergedAt: string;
};

export type OpenSourceRepo = {
  owner: string;
  name: string;
  url: string;
  description: string;
  stars: number;
  language: string | null;
  avatarUrl: string;
  pullRequests: OpenSourcePullRequest[];
};

const USERNAME = person.links.github.split("/").filter(Boolean).pop()!;
/** His own account and org — excluded so this only shows contributions to other people's projects. */
const OWN_SCOPES = [USERNAME, "CodeForgeAI-io"];

const FETCH_OPTS = {
  next: { revalidate: 3600 },
  headers: {
    Accept: "application/vnd.github+json",
    "User-Agent": "nitheeshdr.in",
  },
} as const;

type SearchIssueItem = {
  title: string;
  html_url: string;
  number: number;
  closed_at: string | null;
  repository_url: string;
};

type RepoResponse = {
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  owner: { avatar_url: string };
};

/**
 * Real merged PRs into other people's repos, found via GitHub's public
 * search API — same zero-token approach as the contribution heatmap, since
 * there's no auth-free way to ask "which of my PRs were merged" otherwise.
 */
export async function getOpenSourceContributions(): Promise<OpenSourceRepo[]> {
  const exclusions = OWN_SCOPES.map((scope) => `-user:${scope}`).join(" ");
  const query = `author:${USERNAME} type:pr is:merged is:public ${exclusions}`;

  let items: SearchIssueItem[];
  try {
    const res = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=50`,
      FETCH_OPTS
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { items?: SearchIssueItem[] };
    items = json.items ?? [];
  } catch {
    return [];
  }
  if (!items.length) return [];

  const byRepo = new Map<string, OpenSourcePullRequest[]>();
  for (const item of items) {
    const fullName = item.repository_url.replace(
      "https://api.github.com/repos/",
      ""
    );
    const prs = byRepo.get(fullName) ?? [];
    prs.push({
      title: item.title,
      url: item.html_url,
      number: item.number,
      mergedAt: item.closed_at ?? "",
    });
    byRepo.set(fullName, prs);
  }

  const repos = await Promise.all(
    Array.from(byRepo.entries()).map(
      async ([fullName, pullRequests]): Promise<OpenSourceRepo | null> => {
        const [owner, name] = fullName.split("/") as [string, string];
        try {
          const res = await fetch(
            `https://api.github.com/repos/${fullName}`,
            FETCH_OPTS
          );
          if (!res.ok) return null;
          const repo = (await res.json()) as RepoResponse;
          return {
            owner,
            name,
            url: repo.html_url,
            description: repo.description ?? "",
            stars: repo.stargazers_count,
            language: repo.language,
            avatarUrl: repo.owner.avatar_url,
            pullRequests: pullRequests.sort((a, b) =>
              b.mergedAt.localeCompare(a.mergedAt)
            ),
          };
        } catch {
          return null;
        }
      }
    )
  );

  return repos
    .filter((r): r is OpenSourceRepo => r !== null)
    .sort((a, b) => b.stars - a.stars);
}

const OPEN_SOURCE_GRADIENT =
  "linear-gradient(140deg, #1f2937 0%, #374151 60%, #1f2937 100%)";

/**
 * Maps live GitHub contribution data into the same Project shape used for
 * his own (MongoDB-backed) work, so the existing filter tabs, grid cards,
 * detail-page route, and JSON-LD generation all handle open-source entries
 * for free — no parallel UI or schema code needed.
 */
export async function getOpenSourceProjects(): Promise<Project[]> {
  const repos = await getOpenSourceContributions();

  return repos.map((repo): Project => {
    const prCount = repo.pullRequests.length;
    return {
      id: openSourceProjectId(repo.owner, repo.name),
      name: `${repo.owner}/${repo.name}`,
      iconLabel: repo.name,
      category: "Open Source",
      headline:
        repo.description ||
        `${prCount} merged pull request${prCount === 1 ? "" : "s"} in ${repo.owner}/${repo.name}`,
      description:
        repo.description ||
        `Contributed ${prCount} merged pull request${prCount === 1 ? "" : "s"} to ${repo.owner}/${repo.name}.`,
      meta: `Open Source Contribution${prCount > 1 ? "s" : ""}`,
      githubUrl: repo.url,
      language: repo.language ?? "—",
      logo: repo.avatarUrl,
      gradient: OPEN_SOURCE_GRADIENT,
      kind: "software",
      pullRequests: repo.pullRequests.map((pr) => ({
        title: pr.title,
        url: pr.url,
        number: pr.number,
      })),
    };
  });
}
