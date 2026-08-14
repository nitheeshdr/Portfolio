import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared branded template for every route's opengraph-image — keeps social cards visually consistent site-wide. */
export function renderOgImage({
  eyebrow = "nitheeshdr.in",
  title,
  subtitle,
  footer = "Nitheesh Rajendran",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer?: string;
}): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 78% 22%, rgba(0,102,255,0.35), transparent 55%), radial-gradient(circle at 12% 88%, rgba(0,102,255,0.18), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#0066FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              color: "white",
            }}
          >
            N
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.65)" }}>{eyebrow}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: title.length > 32 ? 56 : 68,
              fontWeight: 600,
              color: "white",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 32,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          ) : null}
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.45)" }}>{footer}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
