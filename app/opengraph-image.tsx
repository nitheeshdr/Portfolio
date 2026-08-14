import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nitheesh Rajendran — Full Stack Engineer & AI Product Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.65)" }}>
            nitheeshdr.in
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              color: "white",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Nitheesh Rajendran
          </div>
          <div
            style={{
              fontSize: 34,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-0.01em",
            }}
          >
            Full-stack engineer &amp; AI product builder
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Founder, Setups Works
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
