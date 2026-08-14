import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContactCard } from "@/components/contact/contact-card";
import { getPublishedPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, blogListSchema, breadcrumbSchema } from "@/components/seo/json-ld";
import { FadeIn } from "@/components/ui/motion-primitives";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Writing from Nitheesh Rajendran on software engineering, AI products, and building at Setups Works.",
  path: "/blog",
});

export default async function BlogPage(): Promise<ReactNode> {
  const posts = await getPublishedPosts();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <JsonLd
        items={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogListSchema(
            posts.map((post) => ({
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              datePublished: post.publishedAt ?? post.createdAt,
            }))
          ),
        ]}
      />

      <section className="mx-auto w-full max-w-275 px-6 pt-12 pb-16 sm:px-10 sm:pt-16 sm:pb-20 md:pt-28">
        <FadeIn className="flex flex-col items-center gap-5 text-center">
          <h1 className="font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3.25rem] lg:text-[3.75rem]">
            Blog
          </h1>
          <p className="max-w-[36ch] text-[20px] leading-[1.4] tracking-tight text-foreground/65 sm:text-[22px]">
            Notes on engineering, AI products, and building at Setups Works.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-275 px-6 pb-16 sm:px-10 sm:pb-20">
        {posts.length === 0 ? (
          <FadeIn className="border-foreground/8 bg-foreground/2 dark:bg-foreground/5 rounded-4xl border py-20 text-center">
            <p className="text-foreground/60 text-[15px] tracking-tight">
              No posts yet — check back soon.
            </p>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((post, index) => (
              <FadeIn key={post.id} delay={Math.min(index * 0.06, 0.3)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="focus-ring group flex flex-col gap-4 rounded-3xl border border-foreground/8 bg-background p-3 transition-colors hover:bg-foreground/2 dark:hover:bg-foreground/5 sm:p-3.5"
                >
                  {post.coverImage ? (
                    <div className="ring-foreground/5 relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-2 px-1 pb-2">
                    <h2 className="text-[18px] font-medium leading-[1.25] tracking-tight text-foreground sm:text-[20px]">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="text-[14px] leading-normal tracking-tight text-foreground/65 sm:text-[15px]">
                        {post.excerpt}
                      </p>
                    ) : null}
                    {post.publishedAt ? (
                      <time
                        dateTime={post.publishedAt}
                        className="text-foreground/45 text-[12px] tracking-tight"
                      >
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    ) : null}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <ContactCard />
    </main>
  );
}

export const revalidate = 60;
