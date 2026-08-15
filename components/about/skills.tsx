import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBrain,
  faCloud,
  faCode,
  faDatabase,
  faLaptopCode,
  faServer,
  faShieldHalved,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";

import { person } from "@/lib/person";

const GROUP_ICONS: Record<string, IconDefinition> = {
  Languages: faCode,
  Frontend: faLaptopCode,
  Backend: faServer,
  Data: faDatabase,
  "AI & LLMs": faBrain,
  "Cloud & DevOps": faCloud,
  Security: faShieldHalved,
  "Tools & Platforms": faWrench,
};

export function Skills(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
        Skills
      </h3>
      <div className="flex flex-col gap-4 rounded-4xl border border-foreground/5 bg-foreground/2 p-4 sm:gap-5 sm:p-5 dark:bg-foreground/5">
        {person.skillGroups.map((group) => {
          const Icon = GROUP_ICONS[group.label] ?? faCode;
          return (
            <div key={group.label} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 px-1">
                <FontAwesomeIcon
                  icon={Icon}
                  className="h-3.5 w-3.5 text-foreground/45"
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
