import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";

import { person } from "@/lib/person";

export function Family(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        Family
      </h3>
      <div className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 flex flex-col gap-2 rounded-4xl border p-2 sm:p-4">
        <FamilyRow label="Father" value={person.family.father} />
        <FamilyRow label="Mother" value={person.family.mother} />
        <FamilyRow label="Siblings" value={person.family.siblings.join(", ")} />
      </div>
    </div>
  );
}

function FamilyRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): ReactNode {
  return (
    <div className="bg-background border-foreground/5 flex items-center gap-4 rounded-3xl border p-3">
      <span
        className="border-foreground/15 inline-flex h-10 w-10 shrink-0 items-center justify-center border"
        aria-hidden="true"
        style={{ borderRadius: 12 }}
      >
        <FontAwesomeIcon
          icon={faUsers}
          className="text-foreground/50 h-4 w-4"
        />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-foreground/50 text-[12px] tracking-tight uppercase">
          {label}
        </span>
        <span className="text-foreground text-[15px] font-medium tracking-tight sm:text-[16px]">
          <span className="sr-only">{label}: </span>
          {value}
        </span>
      </div>
    </div>
  );
}
