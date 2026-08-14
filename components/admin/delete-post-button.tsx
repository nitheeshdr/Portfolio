"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

export function DeletePostButton({ id }: { id: string }): ReactNode {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (): Promise<void> => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    setDeleting(true);
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      aria-label="Delete post"
      className="focus-ring border-foreground/10 text-foreground/50 hover:text-red-500 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors disabled:opacity-60"
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
