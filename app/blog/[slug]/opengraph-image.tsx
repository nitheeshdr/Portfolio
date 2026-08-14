import { OG_SIZE, renderOgImage } from "@/lib/og-image";
import { getPostBySlug } from "@/lib/blog";

export const alt = "Blog post — Nitheesh Rajendran";
export const size = OG_SIZE;
export const contentType = "image/png";

type Params = { slug: string };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    return renderOgImage({ title: "Post not found" });
  }

  return renderOgImage({
    eyebrow: "nitheeshdr.in / blog",
    title: post.title,
    ...(post.excerpt ? { subtitle: post.excerpt } : {}),
  });
}
