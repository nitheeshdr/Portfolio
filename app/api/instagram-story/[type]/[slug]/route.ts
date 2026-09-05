import {
  renderInstagramStoryImage,
  type InstagramStoryData,
  type InstagramStoryType,
} from "@/lib/instagram-story";
import { getPostBySlug } from "@/lib/blog";
import { getStoryBySlug } from "@/lib/web-stories";
import { getProjectById } from "@/lib/projects-db";
import { siteConfig } from "@/lib/metadata";

export const runtime = "nodejs";

const VALID_TYPES: readonly InstagramStoryType[] = ["blog", "story", "project"];

type Params = { type: string; slug: string };

/** Satori (next/og) fetches images server-side and needs a real absolute URL — most images here are already-absolute Cloudinary URLs, but local project screenshots are stored as `/projects/*.png`. */
function toAbsoluteUrl(url: string): string {
  return new URL(url, siteConfig.url).toString();
}

async function loadStoryData(
  type: InstagramStoryType,
  slug: string
): Promise<InstagramStoryData | null> {
  if (type === "blog") {
    const post = await getPostBySlug(slug);
    if (!post || !post.published) return null;
    return {
      title: post.title,
      ...(post.excerpt ? { description: post.excerpt } : {}),
      ...(post.coverImage ? { image: toAbsoluteUrl(post.coverImage) } : {}),
      tags: post.tags,
      url: `${siteConfig.url}/blog/${post.slug}`,
    };
  }

  if (type === "story") {
    const story = await getStoryBySlug(slug);
    if (!story || !story.published) return null;
    return {
      title: story.title,
      ...(story.posterImage ? { image: toAbsoluteUrl(story.posterImage) } : {}),
      url: `${siteConfig.url}/stories/${story.slug}`,
    };
  }

  const project = await getProjectById(slug);
  if (!project) return null;
  return {
    title: project.name,
    description: project.description,
    ...(project.image ? { image: toAbsoluteUrl(project.image) } : {}),
    ...(project.techStack ? { tags: project.techStack } : {}),
    url: `${siteConfig.url}/projects/${project.id}`,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
): Promise<Response> {
  const { type, slug } = await params;

  if (!VALID_TYPES.includes(type as InstagramStoryType)) {
    return new Response("Unknown content type.", { status: 400 });
  }

  const data = await loadStoryData(type as InstagramStoryType, slug);

  if (!data) {
    return renderInstagramStoryImage(
      "blog",
      { title: "Content not found", url: siteConfig.url },
      { status: 404 }
    );
  }

  return renderInstagramStoryImage(type as InstagramStoryType, data);
}
