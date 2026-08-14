import type { ReactNode } from "react";
import { ProjectEditor } from "@/components/admin/project-editor";

export default function NewProjectPage(): ReactNode {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground">
        New project
      </h1>
      <ProjectEditor />
    </div>
  );
}
