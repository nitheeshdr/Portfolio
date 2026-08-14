import type { ReactNode } from "react";
import { PostEditor } from "@/components/admin/post-editor";

export default function NewPostPage(): ReactNode {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
        New post
      </h1>
      <PostEditor />
    </div>
  );
}
