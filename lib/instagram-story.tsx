import { ImageResponse } from "next/og";

/** 1080×1920 — Instagram's documented Story canvas size. */
export const INSTAGRAM_STORY_SIZE = { width: 1080, height: 1920 };

const BRAND_COLOR = "#0066FF";
const BACKGROUND_COLOR = "#0a0a0a";

export type InstagramStoryType = "blog" | "story" | "project";

export type InstagramStoryData = {
  title: string;
  description?: string;
  /** Absolute URL — Satori (next/og) fetches images server-side and needs a real network address, not a local path. */
  image?: string;
  tags?: string[];
  url: string;
};

/**
 * Config-driven per-type copy — the one place that knows how a "blog" story
 * card differs from a "project" one, so the renderer below never branches
 * on `type` beyond reading these two strings.
 */
export const storyShareConfig: Record<
  InstagramStoryType,
  { eyebrow: string; ctaLabel: string }
> = {
  blog: { eyebrow: "Blog", ctaLabel: "Read More" },
  story: { eyebrow: "Web Story", ctaLabel: "Read Story" },
  project: { eyebrow: "Featured Project", ctaLabel: "View Project" },
};

/** Ellipsis-truncate — the hard safety net under Satori's own line-clamp, for single long "words" that can't wrap. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function domainLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function titleFontSize(title: string): number {
  if (title.length <= 40) return 72;
  if (title.length <= 70) return 58;
  return 48;
}

/** "N" mark drawn with flex/text (no image file) — same technique as lib/og-image.tsx, and it sidesteps Satori needing an absolute URL for local assets. */
function BrandMark({ size = 88 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: BRAND_COLOR,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.52,
        fontWeight: 700,
        color: "white",
        flexShrink: 0,
      }}
    >
      N
    </div>
  );
}

function CoverImage({
  image,
  alt,
}: {
  image: string | undefined;
  alt: string;
}) {
  const boxStyle = {
    width: "100%",
    height: 920,
    borderRadius: 40,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(160deg, ${BRAND_COLOR} 0%, #0a0a0a 100%)`,
  } as const;

  if (!image) {
    return (
      <div style={boxStyle}>
        <BrandMark size={160} />
      </div>
    );
  }

  return (
    <div style={boxStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori needs a plain <img>, not next/image */}
      <img
        src={image}
        alt={alt}
        width={936}
        height={920}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

/**
 * Renders the branded 1080×1920 Instagram Story card shared across blog
 * posts, Web Stories, and projects — the design differs only by the copy
 * in `storyShareConfig` and whether `tags` is present, never by duplicated
 * layout code.
 */
export function renderInstagramStoryImage(
  type: InstagramStoryType,
  data: InstagramStoryData,
  init?: { status?: number }
): ImageResponse {
  const config = storyShareConfig[type];
  const title = truncate(data.title, 90);
  const description = data.description
    ? truncate(data.description, 140)
    : undefined;
  const tags = (data.tags ?? []).slice(0, 3).map((tag) => truncate(tag, 20));
  const extraTagCount = (data.tags?.length ?? 0) - tags.length;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 64px",
        background: BACKGROUND_COLOR,
        backgroundImage:
          "radial-gradient(circle at 80% 15%, rgba(0,102,255,0.30), transparent 55%), radial-gradient(circle at 10% 90%, rgba(0,102,255,0.16), transparent 45%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <BrandMark />
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {config.eyebrow}
        </div>
      </div>

      <CoverImage image={data.image} alt={title} />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            fontSize: titleFontSize(title),
            fontWeight: 700,
            color: "white",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>

        {description ? (
          <div
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              fontSize: 36,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-0.01em",
            }}
          >
            {description}
          </div>
        ) : null}

        {tags.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "2px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 28,
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
            {extraTagCount > 0 ? (
              <div
                style={{
                  display: "flex",
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 28,
                  fontWeight: 500,
                }}
              >
                +{extraTagCount}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "26px 56px",
            borderRadius: 999,
            background: BRAND_COLOR,
            color: "white",
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          {config.ctaLabel} →
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.45)" }}>
          {domainLabel(data.url)}
        </div>
      </div>
    </div>,
    { ...INSTAGRAM_STORY_SIZE, status: init?.status ?? 200 }
  );
}
