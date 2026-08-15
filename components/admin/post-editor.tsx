"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import type { BlogPost } from "@/lib/blog";

export type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string;
  published: boolean;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PostEditor({ post }: { post?: BlogPost }): ReactNode {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [published, setPublished] = useState(post?.published ?? false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (value: string): void => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleUpload = async (file: File): Promise<void> => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !json.ok || !json.url) {
        setError(json.error ?? "Upload failed.");
        return;
      }
      setCoverImage(json.url);
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug,
      excerpt,
      coverImage,
      content,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/posts/${post!.id}` : "/api/admin/posts",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong.");
        setSaving(false);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">Slug</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              required
              className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">Excerpt</span>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring resize-none rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
              Content (Markdown)
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={18}
              className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 font-mono text-[13px] leading-relaxed tracking-tight text-foreground outline-none"
            />
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
              Cover image
            </span>
            {coverImage ? (
              <div className="border-foreground/10 relative aspect-video w-full overflow-hidden rounded-2xl border">
                <Image src={coverImage} alt="" fill sizes="400px" className="object-cover" />
              </div>
            ) : null}
            <label className="border-foreground/15 hover:bg-foreground/2 dark:hover:bg-foreground/5 focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3.5 py-3 text-[13px] font-medium tracking-tight text-foreground/70 transition-colors">
              {uploading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Uploading...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faImage} className="h-4 w-4" aria-hidden="true" />
                  {coverImage ? "Replace image" : "Upload image"}
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
              Tags (comma-separated)
            </span>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="engineering, ai, product"
              className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
            />
          </label>

          <label className="border-foreground/10 flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-[14px] font-medium tracking-tight text-foreground">
              Published
            </span>
          </label>
        </div>
      </div>

      {error ? <p className="text-[13px] tracking-tight text-red-500">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="focus-ring bg-foreground text-background inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create post"}
        </button>
      </div>
    </form>
  );
}
