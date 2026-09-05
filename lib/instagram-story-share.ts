import { siteConfig } from "@/lib/metadata";
import type { InstagramStoryType } from "@/lib/instagram-story";

export type InstagramShareEvent =
  | "instagram_story_share_clicked"
  | "instagram_story_image_generated"
  | "instagram_story_share_completed"
  | "instagram_story_share_failed";

/**
 * No analytics platform exists in this repo (checked — no gtag/PostHog/
 * Plausible/Vercel Analytics anywhere). This is a documented no-op so the
 * call sites the feature needs are already in place; wiring a real
 * provider later is a one-line change here, not a hunt through every
 * caller.
 */
export function trackInstagramShareEvent(
  event: InstagramShareEvent,
  meta: { contentType: InstagramStoryType; contentId: string; slug: string }
): void {
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[instagram-story] ${event}`, meta);
  }
}

/**
 * Builds the exact canonical URL for the shared content, tagged with UTM
 * params for attribution. Never mutates the page's own canonical/OG
 * metadata — this is only used for the link put in front of the visitor
 * on Instagram.
 */
export function createStoryShareUrl(path: string): string {
  const url = new URL(path, siteConfig.url);
  url.searchParams.set("utm_source", "instagram");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "story_share");
  return url.toString();
}

export async function copyShareUrl(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    // fall through to the legacy fallback below
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export async function generateInstagramStoryImage(
  type: InstagramStoryType,
  slug: string
): Promise<Blob> {
  const res = await fetch(
    `/api/instagram-story/${type}/${encodeURIComponent(slug)}`
  );
  if (!res.ok) {
    throw new Error("Could not generate the Story image.");
  }
  return res.blob();
}

export type ShareStoryResult = "downloaded";

function isMobileDevice(): boolean {
  return (
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
}

/**
 * Instagram has no public web API to open the Story composer pre-filled —
 * `instagram://story-camera` is Meta's own documented URL scheme for
 * jumping straight to Instagram's Story camera (it just can't carry the
 * generated image or link with it; those were already downloaded/copied
 * before this runs). Falls back to instagram.com when the scheme doesn't
 * resolve (desktop, or the app isn't installed) using the same
 * visibility-based timeout every "deep link with a web fallback" pattern
 * relies on, since there's no reliable "is the app installed" check.
 */
function openInstagram(): void {
  if (typeof window === "undefined") return;

  if (!isMobileDevice()) {
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    return;
  }

  const fallbackTimer = window.setTimeout(() => {
    if (!document.hidden) {
      window.open(
        "https://www.instagram.com/",
        "_blank",
        "noopener,noreferrer"
      );
    }
  }, 1500);

  const clearFallback = (): void => {
    window.clearTimeout(fallbackTimer);
    document.removeEventListener("visibilitychange", clearFallback);
  };
  document.addEventListener("visibilitychange", clearFallback);

  window.location.href = "instagram://story-camera";
}

/**
 * Always goes straight to Instagram: the link is copied to the clipboard
 * up front (no extra click needed), the branded image downloads, then
 * Instagram itself opens directly — deliberately skipping the generic
 * `navigator.share()` OS sheet, since that can offer any installed app
 * (Messages, Mail, a random other app) instead of Instagram specifically.
 * The visitor attaches the already-downloaded image and pastes the
 * already-copied link themselves via Instagram's Link Sticker — the only
 * officially-supported way to get a clickable link onto a Story.
 */
export async function shareStory({
  imageBlob,
  fileName,
  url,
}: {
  imageBlob: Blob;
  fileName: string;
  url: string;
}): Promise<ShareStoryResult> {
  await copyShareUrl(url);
  downloadBlob(imageBlob, fileName);
  openInstagram();
  return "downloaded";
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}
