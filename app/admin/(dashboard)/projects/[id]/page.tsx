import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getProjectByMongoId } from "@/lib/projects-db";
import { ProjectEditor } from "@/components/admin/project-editor";

type Params = { id: string };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<Params>;
}): Promise<ReactNode> {
  const { id } = await params;
  const project = await getProjectByMongoId(id);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
        Edit project
      </h1>
      <ProjectEditor project={project} />
    </div>
  );
}

export const dynamic = "force-dynamic";
