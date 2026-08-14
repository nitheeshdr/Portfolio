import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Blog — Nitheesh Rajendran";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "nitheeshdr.in / blog",
    title: "Blog",
    subtitle: "Notes on engineering, AI products, and building at Setups Works.",
  });
}
