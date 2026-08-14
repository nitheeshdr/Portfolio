import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ContactCard } from "@/components/contact/contact-card";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, blogPostSchema, breadcrumbSchema } from "@/components/seo/json-ld";
import { FadeIn } from "@/components/ui/motion-primitives";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) return {};

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ...(post.coverImage ? { image: post.coverImage } : {}),
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}): Promise<ReactNode> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <JsonLd
        items={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          ...blogPostSchema({
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            coverImage: post.coverImage,
            datePublished: post.publishedAt ?? post.createdAt,
            dateModified: post.updatedAt,
            tags: post.tags,
          }),
        ]}
      />

      <article className="mx-auto w-full max-w-175 px-6 pt-12 pb-16 sm:px-10 sm:pt-16 sm:pb-20 md:pt-28">
        <FadeIn>
          <Link
            href="/blog"
            className="focus-ring text-foreground/60 hover:text-foreground group mb-8 flex w-fit items-center gap-1.5 text-sm font-medium tracking-tight transition-colors"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All posts
          </Link>

          {post.publishedAt ? (
            <time
              dateTime={post.publishedAt}
              className="text-foreground/50 text-sm tracking-tight"
            >
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          ) : null}
          <h1 className="font-serif mt-3 text-[2.25rem] font-medium leading-[1.05] tracking-tight text-foreground sm:text-[3rem]">
            {post.title}
          </h1>
        </FadeIn>

        {post.coverImage ? (
          <FadeIn delay={0.1} className="mt-10">
            <div className="ring-foreground/5 relative aspect-[16/9] w-full overflow-hidden rounded-3xl ring-1">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
        ) : null}

        <FadeIn delay={0.15} className="prose-content mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </FadeIn>

        {post.tags.length ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="border-foreground/8 bg-foreground/2 dark:bg-foreground/5 rounded-full border px-3.5 py-1.5 text-[13px] tracking-tight text-foreground/70"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </article>

      <ContactCard />
    </main>
  );
}

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const revalidate = 60;
