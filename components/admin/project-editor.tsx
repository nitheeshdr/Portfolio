"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { PROJECT_CATEGORIES } from "@/components/projects/projects-data";
import type { ProjectRecord } from "@/lib/projects-db";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectEditor({ project }: { project?: ProjectRecord }): ReactNode {
  const router = useRouter();
  const isEdit = Boolean(project);

  const [name, setName] = useState(project?.name ?? "");
  const [id, setId] = useState(project?.id ?? "");
  const [idTouched, setIdTouched] = useState(isEdit);
  const [category, setCategory] = useState(project?.category ?? PROJECT_CATEGORIES[0]);
  const [kind, setKind] = useState<"software" | "design">(project?.kind ?? "software");
  const [headline, setHeadline] = useState(project?.headline ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [meta, setMeta] = useState(project?.meta ?? "");
  const [language, setLanguage] = useState(project?.language ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [playStoreUrl, setPlayStoreUrl] = useState(project?.playStoreUrl ?? "");
  const [dribbbleUrl, setDribbbleUrl] = useState(project?.dribbbleUrl ?? "");
  const [image, setImage] = useState(project?.image ?? "");
  const [imageAlt, setImageAlt] = useState(project?.imageAlt ?? "");
  const [techStack, setTechStack] = useState(project?.techStack?.join(", ") ?? "");
  const [features, setFeatures] = useState(project?.features?.join("\n") ?? "");
  const [applicationCategory, setApplicationCategory] = useState(
    project?.applicationCategory ?? ""
  );
  const [operatingSystem, setOperatingSystem] = useState(project?.operatingSystem ?? "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (value: string): void => {
    setName(value);
    if (!idTouched) setId(slugify(value));
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
      setImage(json.url);
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
      id,
      name,
      iconLabel: name,
      category,
      kind,
      headline,
      description,
      meta,
      language,
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
      playStoreUrl: playStoreUrl || undefined,
      dribbbleUrl: dribbbleUrl || undefined,
      image: image || undefined,
      imageAlt: imageAlt || undefined,
      techStack: techStack.split(",").map((t) => t.trim()).filter(Boolean),
      features: features.split("\n").map((f) => f.trim()).filter(Boolean),
      applicationCategory: applicationCategory || undefined,
      operatingSystem: operatingSystem || undefined,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/projects/${project!.mongoId}` : "/api/admin/projects",
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
      router.push("/admin/projects");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  const inputClass =
    "border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none";
  const labelClass = "text-foreground/70 text-[13px] font-medium tracking-tight";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Id (slug)</span>
              <input
                type="text"
                value={id}
                onChange={(e) => {
                  setIdTouched(true);
                  setId(slugify(e.target.value));
                }}
                required
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className={inputClass}
              >
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Kind</span>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as "software" | "design")}
                className={inputClass}
              >
                <option value="software">Software</option>
                <option value="design">Design (Dribbble)</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Headline</span>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Meta (role, dates)</span>
              <input
                type="text"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                required
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Language / tool</span>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>GitHub URL</span>
              <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Live URL</span>
              <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Play Store URL</span>
              <input type="url" value={playStoreUrl} onChange={(e) => setPlayStoreUrl(e.target.value)} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Dribbble URL</span>
              <input type="url" value={dribbbleUrl} onChange={(e) => setDribbbleUrl(e.target.value)} className={inputClass} />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Tech stack (comma-separated)</span>
            <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} className={inputClass} />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Features (one per line)</span>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className={labelClass}>Screenshot</span>
            {image ? (
              <div className="border-foreground/10 relative aspect-video w-full overflow-hidden rounded-2xl border">
                <Image src={image} alt="" fill sizes="400px" className="object-cover" />
              </div>
            ) : null}
            <label className="border-foreground/15 hover:bg-foreground/2 dark:hover:bg-foreground/5 focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3.5 py-3 text-[13px] font-medium tracking-tight text-foreground/70 transition-colors">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" aria-hidden="true" />
                  {image ? "Replace image" : "Upload image"}
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
            <span className={labelClass}>Image alt text</span>
            <input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className={inputClass} />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Application category</span>
            <input
              type="text"
              value={applicationCategory}
              onChange={(e) => setApplicationCategory(e.target.value)}
              placeholder="e.g. BusinessApplication"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Operating system</span>
            <input
              type="text"
              value={operatingSystem}
              onChange={(e) => setOperatingSystem(e.target.value)}
              placeholder="e.g. Web, Android"
              className={inputClass}
            />
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
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}
