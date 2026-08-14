import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Projects by Nitheesh Rajendran";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "nitheeshdr.in / projects",
    title: "My recent work",
    subtitle: "SaaS platforms, AI products, and mobile apps — shipped to production.",
  });
}
