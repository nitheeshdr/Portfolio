import {
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  MonitorSmartphone,
  Server,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { person } from "@/lib/person";

const GROUP_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  Frontend: MonitorSmartphone,
  Backend: Server,
  Data: Database,
  "AI & LLMs": BrainCircuit,
  "Cloud & DevOps": Cloud,
  Security: ShieldCheck,
  "Tools & Platforms": Wrench,
};

export function Skills(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
        Skills
      </h3>
      <div className="flex flex-col gap-4 rounded-4xl border border-foreground/5 bg-foreground/2 p-4 sm:gap-5 sm:p-5 dark:bg-foreground/5">
        {person.skillGroups.map((group) => {
          const Icon = GROUP_ICONS[group.label] ?? Code2;
          return (
            <div key={group.label} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 px-1">
                <Icon
                  className="h-3.5 w-3.5 text-foreground/45"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
                <span className="text-[13px] font-medium tracking-tight text-foreground/55 uppercase">
                  {group.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-foreground/8 bg-background px-3.5 py-1.5 text-[13px] tracking-tight text-foreground/85 sm:text-[14px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
