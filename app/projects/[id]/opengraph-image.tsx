import { OG_SIZE, renderOgImage } from "@/lib/og-image";
import { getProjectBySlug } from "@/lib/projects-db";

export const alt = "Project — Nitheesh Rajendran";
export const size = OG_SIZE;
export const contentType = "image/png";

type Params = { id: string };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const project = await getProjectBySlug(id);

  if (!project) {
    return renderOgImage({ title: "Project not found" });
  }

  return renderOgImage({
    eyebrow: `nitheeshdr.in / ${project.category}`,
    title: project.name,
    subtitle: project.headline,
  });
}
