import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/blog";
import { PostEditor } from "@/components/admin/post-editor";

type Params = { id: string };

export default async function EditPostPage({
  params,
}: {
  params: Promise<Params>;
}): Promise<ReactNode> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
        Edit post
      </h1>
      <PostEditor post={post} />
    </div>
  );
}

export const dynamic = "force-dynamic";
