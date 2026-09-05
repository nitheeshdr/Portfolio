"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCheck,
  faLink,
  faShareNodes,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  copyShareUrl,
  generateInstagramStoryImage,
  shareStory,
  trackInstagramShareEvent,
} from "@/lib/instagram-story-share";
import type { InstagramStoryType } from "@/lib/instagram-story";

export type InstagramStoryShareData = {
  slug: string;
  title: string;
  description?: string | undefined;
  image?: string | undefined;
  tags?: string[] | undefined;
  /** The share URL to hand to every platform below — already UTM-tagged via createStoryShareUrl(). */
  url: string;
};

type Phase = "idle" | "generating" | "error";

function fileNameFor(type: InstagramStoryType, slug: string): string {
  return `${type}-${slug}-instagram-story.png`;
}

function openShareIntent(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
}

export function ShareButton({
  type,
  data,
}: {
  type: InstagramStoryType;
  data: InstagramStoryShareData;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const contentId = data.slug;
  const busy = phase === "generating";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent): void => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleInstagramShare = async (): Promise<void> => {
    trackInstagramShareEvent("instagram_story_share_clicked", {
      contentType: type,
      contentId,
      slug: data.slug,
    });

    setPhase("generating");
    setError("");

    try {
      const blob = await generateInstagramStoryImage(type, data.slug);
      trackInstagramShareEvent("instagram_story_image_generated", {
        contentType: type,
        contentId,
        slug: data.slug,
      });

      await shareStory({
        imageBlob: blob,
        fileName: fileNameFor(type, data.slug),
        url: data.url,
      });

      trackInstagramShareEvent("instagram_story_share_completed", {
        contentType: type,
        contentId,
        slug: data.slug,
      });

      setOpen(false);
      setPhase("idle");
    } catch (err) {
      trackInstagramShareEvent("instagram_story_share_failed", {
        contentType: type,
        contentId,
        slug: data.slug,
      });
      setError(
        err instanceof Error ? err.message : "Couldn't create the Story image."
      );
      setPhase("error");
    }
  };

  const handleCopyLink = async (): Promise<void> => {
    const copied = await copyShareUrl(data.url);
    setLinkCopied(copied);
    if (copied) window.setTimeout(() => setLinkCopied(false), 2000);
  };

  const platformLinks: Array<{
    label: string;
    icon: IconDefinition;
    href: string;
  }> = [
    {
      label: "WhatsApp",
      icon: faWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${data.title} ${data.url}`)}`,
    },
    {
      label: "X",
      icon: faXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(data.url)}`,
    },
    {
      label: "LinkedIn",
      icon: faLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`,
    },
    {
      label: "Facebook",
      icon: faFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
    },
  ];

  return (
    <div ref={panelRef} className="relative flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Share this page"
        className="focus-ring border-foreground/8 bg-background text-foreground hover:bg-foreground/5 inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium tracking-tight transition-colors"
      >
        <FontAwesomeIcon
          icon={faShareNodes}
          className="h-4 w-4"
          aria-hidden="true"
        />
        Share
      </button>

      {open ? (
        <div className="border-foreground/8 bg-background absolute top-full left-0 z-20 mt-2 flex w-64 flex-col gap-1 rounded-2xl border p-2 shadow-lg">
          <button
            type="button"
            onClick={handleInstagramShare}
            disabled={busy}
            aria-busy={busy}
            className="focus-ring text-foreground hover:bg-foreground/5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FontAwesomeIcon
              icon={busy ? faSpinner : faInstagram}
              className={`h-4 w-4 shrink-0 ${busy ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {busy ? "Creating your Story…" : "Instagram Story"}
          </button>

          {platformLinks.map((platform) => (
            <button
              key={platform.label}
              type="button"
              onClick={() => {
                openShareIntent(platform.href);
                setOpen(false);
              }}
              className="focus-ring text-foreground hover:bg-foreground/5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium tracking-tight transition-colors"
            >
              <FontAwesomeIcon
                icon={platform.icon}
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              {platform.label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleCopyLink}
            className="focus-ring text-foreground hover:bg-foreground/5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium tracking-tight transition-colors"
          >
            <FontAwesomeIcon
              icon={linkCopied ? faCheck : faLink}
              className={`h-4 w-4 shrink-0 ${linkCopied ? "text-emerald-500" : ""}`}
              aria-hidden="true"
            />
            {linkCopied ? "Link copied" : "Copy link"}
          </button>

          {phase === "error" ? (
            <p className="flex items-center gap-1.5 px-3 pt-1 text-[12px] tracking-tight text-red-500">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="h-3 w-3 shrink-0"
                aria-hidden="true"
              />
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
