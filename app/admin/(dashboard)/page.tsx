import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderTree, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAllPosts } from "@/lib/blog";
import { getAllProjects } from "@/lib/projects-db";

export default async function AdminDashboardPage(): Promise<ReactNode> {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const publishedPosts = posts.filter((p) => p.published).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-foreground/60 mt-1 text-[14px] tracking-tight">
          Manage your site&rsquo;s blog and projects.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/blog"
          className="border-foreground/10 hover:bg-foreground/2 dark:hover:bg-foreground/5 focus-ring flex flex-col gap-3 rounded-3xl border p-6 transition-colors"
        >
          <span className="bg-foreground/10 text-foreground inline-flex h-10 w-10 items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faNewspaper} className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="text-foreground text-[15px] font-semibold tracking-tight">
            Blog posts
          </span>
          <span className="text-foreground/60 text-[14px] tracking-tight">
            {posts.length} total &middot; {publishedPosts} published
          </span>
        </Link>

        <Link
          href="/admin/projects"
          className="border-foreground/10 hover:bg-foreground/2 dark:hover:bg-foreground/5 focus-ring flex flex-col gap-3 rounded-3xl border p-6 transition-colors"
        >
          <span className="bg-foreground/10 text-foreground inline-flex h-10 w-10 items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faFolderTree} className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="text-foreground text-[15px] font-semibold tracking-tight">
            Projects
          </span>
          <span className="text-foreground/60 text-[14px] tracking-tight">
            {projects.length} total
          </span>
        </Link>
      </div>
    </div>
  );
}
