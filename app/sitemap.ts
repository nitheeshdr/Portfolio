import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/metadata";
import { getAllProjects, getProjectUpdateDates } from "@/lib/projects-db";
import { getOpenSourceProjects, getOwnGithubProjects } from "@/lib/open-source";
import { getPublishedStories } from "@/lib/web-stories";

/** Latest of a set of dates, falling back to `fallback` when the list is empty (no real content dates to derive from). */
function latestOf(dates: Date[], fallback: Date): Date {
  return dates.length
    ? new Date(Math.max(...dates.map((d) => d.getTime())))
    : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const buildTime = new Date();
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

  return [
    {
      url: baseUrl,
      lastModified: buildTime,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: buildTime,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: latestOf(projectDates, buildTime),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: projectUpdateDates.get(project.id) ?? buildTime,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Live-fetched from GitHub (contributions to others' repos, and his own
    // repos not already curated above) — no stored updatedAt, so build time.
    ...openSourceProjects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: buildTime,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...ownGithubProjects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: buildTime,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    {
      url: `${baseUrl}/blog`,
      lastModified: latestOf(postDates, buildTime),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${baseUrl}/stories`,
      lastModified: latestOf(storyDates, buildTime),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...stories.map((story) => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: new Date(story.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
