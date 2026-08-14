import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "About Nitheesh Rajendran";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "nitheeshdr.in / about",
    title: "About Nitheesh",
    subtitle: "Founder & CEO of Setups Works — software, AI, and film.",
  });
}
