import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Web Stories — Nitheesh Rajendran";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "nitheeshdr.in / stories",
    title: "Web Stories",
    subtitle: "Short, swipeable visual stories on building products and filmmaking.",
  });
}
