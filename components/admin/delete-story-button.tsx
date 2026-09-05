"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

export function DeleteStoryButton({ id }: { id: string }): ReactNode {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (): Promise<void> => {
    if (!window.confirm("Delete this story? This can't be undone.")) return;
    setDeleting(true);
    await fetch(`/api/admin/stories/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      aria-label="Delete story"
      className="focus-ring border-foreground/10 text-foreground/50 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors hover:text-red-500 disabled:opacity-60"
    >
      <FontAwesomeIcon
        icon={faTrashCan}
        className="h-3.5 w-3.5"
        aria-hidden="true"
      />
    </button>
  );
}
