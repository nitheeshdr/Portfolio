import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAllProjects } from "@/lib/projects-db";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";

export default async function AdminProjectsListPage(): Promise<ReactNode> {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-foreground/60 mt-1 text-[14px] tracking-tight">
            {projects.length} total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="focus-ring bg-foreground text-background inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="border-foreground/10 rounded-3xl border border-dashed p-10 text-center">
          <p className="text-foreground/60 text-[14px] tracking-tight">No projects yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div
              key={project.mongoId}
              className="border-foreground/8 flex items-center justify-between gap-4 rounded-2xl border p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium tracking-tight text-foreground">
                  {project.name}
                </p>
                <p className="text-foreground/50 text-[13px] tracking-tight">
                  /{project.id} &middot; {project.category}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/projects/${project.mongoId}`}
                  className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground rounded-lg border px-3 py-1.5 text-[13px] font-medium tracking-tight transition-colors"
                >
                  Edit
                </Link>
                <DeleteProjectButton mongoId={project.mongoId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
