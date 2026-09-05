import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAllStories } from "@/lib/web-stories";
import { DeleteStoryButton } from "@/components/admin/delete-story-button";

export default async function AdminStoriesListPage(): Promise<ReactNode> {
  const stories = await getAllStories();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground font-serif text-[1.75rem] font-medium tracking-tight">
            Web Stories
          </h1>
          <p className="text-foreground/60 mt-1 text-[14px] tracking-tight">
            {stories.length} total
          </p>
        </div>
        <Link
          href="/admin/stories/new"
          className="focus-ring bg-foreground text-background inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
        >
          <FontAwesomeIcon
            icon={faPlus}
            className="h-4 w-4"
            aria-hidden="true"
          />
          New story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="border-foreground/10 rounded-3xl border border-dashed p-10 text-center">
          <p className="text-foreground/60 text-[14px] tracking-tight">
            No stories yet. Create your first one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {stories.map((story) => (
            <div
              key={story.id}
              className="border-foreground/8 flex items-center justify-between gap-4 rounded-2xl border p-4"
            >
              <div className="min-w-0">
                <p className="text-foreground truncate text-[15px] font-medium tracking-tight">
                  {story.title}
                </p>
                <p className="text-foreground/50 text-[13px] tracking-tight">
                  /stories/{story.slug} &middot; {story.pages.length} page
                  {story.pages.length === 1 ? "" : "s"} &middot;{" "}
                  {story.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/stories/${story.id}`}
                  className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground rounded-lg border px-3 py-1.5 text-[13px] font-medium tracking-tight transition-colors"
                >
                  Edit
                </Link>
                <DeleteStoryButton id={story.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
