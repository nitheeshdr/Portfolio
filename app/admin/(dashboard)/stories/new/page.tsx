import type { ReactNode } from "react";
import { StoryEditor } from "@/components/admin/story-editor";

export default function NewStoryPage(): ReactNode {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground font-serif text-[1.75rem] font-medium tracking-tight">
        New story
      </h1>
      <StoryEditor />
    </div>
  );
}
