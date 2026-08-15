import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAllPosts } from "@/lib/blog";
import { DeletePostButton } from "@/components/admin/delete-post-button";

export default async function AdminBlogListPage(): Promise<ReactNode> {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
            Blog posts
          </h1>
          <p className="text-foreground/60 mt-1 text-[14px] tracking-tight">
            {posts.length} total
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="focus-ring bg-foreground text-background inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" aria-hidden="true" />
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border-foreground/10 rounded-3xl border border-dashed p-10 text-center">
          <p className="text-foreground/60 text-[14px] tracking-tight">
            No posts yet. Create your first one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-foreground/8 flex items-center justify-between gap-4 rounded-2xl border p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium tracking-tight text-foreground">
                  {post.title}
                </p>
                <p className="text-foreground/50 text-[13px] tracking-tight">
                  /{post.slug} &middot; {post.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground rounded-lg border px-3 py-1.5 text-[13px] font-medium tracking-tight transition-colors"
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
