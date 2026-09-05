import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/metadata";
import { getAllProjects } from "@/lib/projects-db";
import { getPublishedStories } from "@/lib/web-stories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const lastModified = new Date();
  const [projects, posts, stories] = await Promise.all([
    getAllProjects(),
    getPublishedPosts(),
    getPublishedStories(),
  ]);

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/blog`,
      lastModified,
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
      lastModified,
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
