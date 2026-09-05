"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPlus,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import type { WebStory, WebStoryPage } from "@/lib/web-stories";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const json = (await res.json()) as {
      ok: boolean;
      url?: string;
      error?: string;
    };
    if (!res.ok || !json.ok || !json.url) {
      return { error: json.error ?? "Upload failed." };
    }
    return { url: json.url };
  } catch {
    return { error: "Network error during upload." };
  }
}

/** Local-only key so React can track each page row across add/remove/reorder — never sent to the API. */
type EditablePage = WebStoryPage & { key: string };

function newPage(): EditablePage {
  return {
    key: crypto.randomUUID(),
    image: "",
    imageAlt: "",
    heading: "",
    text: "",
  };
}

export function StoryEditor({ story }: { story?: WebStory }): ReactNode {
  const router = useRouter();
  const isEdit = Boolean(story);

  const [title, setTitle] = useState(story?.title ?? "");
  const [slug, setSlug] = useState(story?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [posterImage, setPosterImage] = useState(story?.posterImage ?? "");
  const [pages, setPages] = useState<EditablePage[]>(
    story?.pages.length
      ? story.pages.map((p) => ({ ...p, key: crypto.randomUUID() }))
      : [newPage()]
  );
  const [ctaLabel, setCtaLabel] = useState(story?.ctaLabel ?? "");
  const [ctaUrl, setCtaUrl] = useState(story?.ctaUrl ?? "");
  const [published, setPublished] = useState(story?.published ?? false);

  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingPageKey, setUploadingPageKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const uploading = uploadingPoster || uploadingPageKey !== null;

  const handleTitleChange = (value: string): void => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handlePosterUpload = async (file: File): Promise<void> => {
    setUploadingPoster(true);
    setError("");
    const result = await uploadImage(file);
    if (result.url) setPosterImage(result.url);
    else setError(result.error ?? "Upload failed.");
    setUploadingPoster(false);
  };

  const updatePage = (key: string, patch: Partial<WebStoryPage>): void => {
    setPages((prev) =>
      prev.map((p) => (p.key === key ? { ...p, ...patch } : p))
    );
  };

  const handlePageUpload = async (key: string, file: File): Promise<void> => {
    setUploadingPageKey(key);
    setError("");
    const result = await uploadImage(file);
    if (result.url) updatePage(key, { image: result.url });
    else setError(result.error ?? "Upload failed.");
    setUploadingPageKey(null);
  };

  const removePage = (key: string): void => {
    setPages((prev) =>
      prev.length > 1 ? prev.filter((p) => p.key !== key) : prev
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug,
      posterImage,
      pages: pages.map(({ key: _key, ...page }) => page),
      ctaLabel,
      ctaUrl,
      published,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/stories/${story!.id}` : "/api/admin/stories",
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
      router.push("/admin/stories");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
                Title
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring text-foreground rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight outline-none"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
                Slug
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                required
                className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring text-foreground rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight outline-none"
              />
              <span className="text-foreground/40 text-[12px] tracking-tight">
                Will publish at /stories/{slug || "…"}
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
                Pages
              </span>
              <button
                type="button"
                onClick={() => setPages((prev) => [...prev, newPage()])}
                className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium tracking-tight transition-colors"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="h-3 w-3"
                  aria-hidden="true"
                />
                Add page
              </button>
            </div>

            {pages.map((page, index) => (
              <div
                key={page.key}
                className="border-foreground/10 flex flex-col gap-3 rounded-2xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground/50 text-[12px] font-medium tracking-tight uppercase">
                    Page {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePage(page.key)}
                    disabled={pages.length === 1}
                    aria-label="Remove page"
                    className="focus-ring text-foreground/40 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
                  <div className="flex flex-col gap-1.5">
                    {page.image ? (
                      <div className="border-foreground/10 relative aspect-[9/16] w-full overflow-hidden rounded-xl border">
                        <Image
                          src={page.image}
                          alt=""
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <label className="border-foreground/15 hover:bg-foreground/2 dark:hover:bg-foreground/5 focus-ring text-foreground/70 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed px-2 py-2.5 text-[12px] font-medium tracking-tight transition-colors">
                      {uploadingPageKey === page.key ? (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="h-3.5 w-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faImage}
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      )}
                      {page.image ? "Replace" : "Upload"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handlePageUpload(page.key, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <input
                      type="text"
                      value={page.heading}
                      onChange={(e) =>
                        updatePage(page.key, { heading: e.target.value })
                      }
                      placeholder="Heading (optional)"
                      className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring text-foreground rounded-lg border px-3 py-2 text-[14px] tracking-tight outline-none"
                    />
                    <textarea
                      value={page.text}
                      onChange={(e) =>
                        updatePage(page.key, { text: e.target.value })
                      }
                      placeholder="Text (optional)"
                      rows={2}
                      className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring text-foreground resize-none rounded-lg border px-3 py-2 text-[14px] tracking-tight outline-none"
                    />
                    <input
                      type="text"
                      value={page.imageAlt}
                      onChange={(e) =>
                        updatePage(page.key, { imageAlt: e.target.value })
                      }
                      placeholder="Image alt text"
                      className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring text-foreground rounded-lg border px-3 py-2 text-[13px] tracking-tight outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
              Poster image (portrait, e.g. 720&times;1280)
            </span>
            {posterImage ? (
              <div className="border-foreground/10 relative aspect-[3/4] w-full overflow-hidden rounded-2xl border">
                <Image
                  src={posterImage}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <label className="border-foreground/15 hover:bg-foreground/2 dark:hover:bg-foreground/5 focus-ring text-foreground/70 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3.5 py-3 text-[13px] font-medium tracking-tight transition-colors">
              {uploadingPoster ? (
                <>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faImage}
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  {posterImage ? "Replace image" : "Upload image"}
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handlePosterUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
              CTA label (optional)
            </span>
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Read the full story"
              className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring text-foreground rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
              CTA link (optional)
            </span>
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="https://…"
              className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring text-foreground rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight outline-none"
            />
          </label>

          <label className="border-foreground/10 flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-foreground text-[14px] font-medium tracking-tight">
              Published
            </span>
          </label>
        </div>
      </div>

      {error ? (
        <p className="text-[13px] tracking-tight text-red-500">{error}</p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="focus-ring bg-foreground text-background inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create story"}
        </button>
      </div>
    </form>
  );
}
