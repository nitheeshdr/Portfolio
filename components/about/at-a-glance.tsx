import type { ReactNode } from "react";

import { person } from "@/lib/person";

const birthDateLabel = new Date(person.birthDate).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Visible facts that mirror the Person structured data (birth, education,
 * company, family, films) — Google weighs on-page text alongside schema.
 */
export function AtAGlance(): ReactNode {
  const rows: Array<{ label: string; value: ReactNode }> = [
    { label: "Full name", value: person.name },
    {
      label: "Born",
      value: (
        <>
          <time dateTime={person.birthDate}>{birthDateLabel}</time>,{" "}
          {person.birthPlace}
        </>
      ),
    },
    { label: "Based in", value: person.location },
    {
      label: "Occupation",
      value: "Film director, founder & CEO, full stack developer",
    },
    {
      label: "Company",
      value: (
        <>
          {person.company.role} of{" "}
          <a
            href={person.company.url}
            className="focus-ring underline underline-offset-2"
          >
            {person.company.name}
          </a>{" "}
          ({person.company.period})
        </>
      ),
    },
    {
      label: "Education",
      value: `${person.education.degree}, ${person.education.school} (${person.education.alternateName})`,
    },
    {
      label: "Films",
      value: person.filmography.map((film) => film.title).join(", "),
    },
    {
      label: "Parents",
      value: `${person.family.father}, ${person.family.mother}`,
    },
    { label: "Siblings", value: person.family.siblings.join(", ") },
    { label: "Languages", value: person.languages.join(", ") },
  ];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-foreground text-[15px] font-semibold tracking-tight">
        At a glance
      </h2>
      <dl className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 grid gap-x-6 gap-y-3 rounded-4xl border p-5 text-[14px] tracking-tight sm:grid-cols-[8rem_1fr] sm:text-[15px]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-foreground/50">{row.label}</dt>
            <dd className="text-foreground/85">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
