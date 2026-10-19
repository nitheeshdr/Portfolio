import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/metadata";
import { getAllProjects, getProjectUpdateDates } from "@/lib/projects-db";
import { getOpenSourceProjects, getOwnGithubProjects } from "@/lib/open-source";
import { getPublishedStories } from "@/lib/web-stories";

type Entry = MetadataRoute.Sitemap[number];

/** Latest of a set of dates, or undefined when there are none — a missing date beats an invented one. */
function latestOf(dates: Date[]): Date | undefined {
  return dates.length
    ? new Date(Math.max(...dates.map((d) => d.getTime())))
    : undefined;
}

/** Absolute URL for a root-relative asset; leaves an already-absolute URL (Cloudinary, Play Store) as is. */
function absolute(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${siteConfig.url}${path}`;
}

/**
 * Builds a sitemap entry without ever emitting a made-up `lastModified`: it is
 * only included when the caller has a real content date. Google ignores
 * `priority`/`changeFrequency`, but an untrustworthy `lastmod` (e.g. "now" on
 * every request) makes it discount the field for the whole site.
 */
function entry(
  path: string,
  options: { lastModified?: Date; images?: Array<string | undefined> } = {}
): Entry {
  const images = [...new Set((options.images ?? []).filter(Boolean))].map((i) =>
    absolute(i as string)
  );
  return {
    url: `${siteConfig.url}${path}`,
    ...(options.lastModified ? { lastModified: options.lastModified } : {}),
    ...(images.length ? { images } : {}),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, projectUpdateDates, posts, stories] = await Promise.all([
    getAllProjects(),
    getProjectUpdateDates(),
    getPublishedPosts(),
    getPublishedStories(),
  ]);

  const featuredGithubUrls = projects
    .map((p) => p.githubUrl)
    .filter((url): url is string => Boolean(url));
  const [openSourceProjects, ownGithubProjects] = await Promise.all([
    getOpenSourceProjects(),
    getOwnGithubProjects(featuredGithubUrls),
  ]);

  const projectDates = Array.from(projectUpdateDates.values());
  const postDates = posts.map((p) => new Date(p.updatedAt));
  const storyDates = stories.map((s) => new Date(s.updatedAt));
  const siteLastModified = latestOf([
    ...projectDates,
    ...postDates,
    ...storyDates,
  ]);

  return [
    // Home: it surfaces projects, apps and posts, so it changes when any does.
    entry("/", {
      ...(siteLastModified ? { lastModified: siteLastModified } : {}),
    }),
    // /about is hand-written content with no stored edit date — omit lastmod.
    entry("/about"),
    entry("/projects", {
      ...(latestOf(projectDates)
        ? { lastModified: latestOf(projectDates)! }
        : {}),
    }),
    ...projects.map((project) =>
      entry(`/projects/${project.id}`, {
        ...(projectUpdateDates.get(project.id)
          ? { lastModified: projectUpdateDates.get(project.id)! }
          : {}),
        images: [project.image, ...(project.screenshots ?? [])],
      })
    ),
    // Live-fetched from GitHub (contributions to others' repos, and his own
    // repos not curated above) — no stored edit date, so no lastmod.
    ...openSourceProjects.map((project) => entry(`/projects/${project.id}`)),
    ...ownGithubProjects.map((project) => entry(`/projects/${project.id}`)),
    entry("/blog", {
      ...(latestOf(postDates) ? { lastModified: latestOf(postDates)! } : {}),
    }),
    ...posts.map((post) =>
      entry(`/blog/${post.slug}`, {
        lastModified: new Date(post.updatedAt),
        images: [post.coverImage],
      })
    ),
    entry("/stories", {
      ...(latestOf(storyDates) ? { lastModified: latestOf(storyDates)! } : {}),
    }),
    ...stories.map((story) =>
      entry(`/stories/${story.slug}`, {
        lastModified: new Date(story.updatedAt),
        images: [story.posterImage],
      })
    ),
  ];
}
