import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";

import { person } from "@/lib/person";

export function Achievements(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        Achievements
      </h3>
      <ul className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 flex flex-col gap-3 rounded-4xl border p-5 sm:p-6">
        {person.achievements.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faTrophy}
              className="text-foreground/40 mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span className="text-foreground/75 text-[14px] leading-normal tracking-tight sm:text-[15px]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
