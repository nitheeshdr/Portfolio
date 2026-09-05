import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getStoryById } from "@/lib/web-stories";
import { StoryEditor } from "@/components/admin/story-editor";

type Params = { id: string };

export default async function EditStoryPage({
  params,
}: {
  params: Promise<Params>;
}): Promise<ReactNode> {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground font-serif text-[1.75rem] font-medium tracking-tight">
        Edit story
      </h1>
      <StoryEditor story={story} />
    </div>
  );
}

export const dynamic = "force-dynamic";
