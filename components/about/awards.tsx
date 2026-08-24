import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward } from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";

import { CertificateCta } from "@/components/shared/certificate-cta";
import { person } from "@/lib/person";

export function Awards(): ReactNode {
  if (!person.awards.length) return null;

  return (
    <div id="awards" className="flex scroll-mt-24 flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        Awards &amp; Recognition
      </h3>
      <div className="flex flex-col gap-3">
        {person.awards.map((award) => (
          <div
            key={award.title}
            className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 flex flex-col gap-4 rounded-4xl border p-5 sm:flex-row sm:p-6"
          >
            <CertificateCta
              title={award.title}
              letterImage={award.image}
              logo={award.issuerLogo}
            />
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faAward}
                  className="h-4 w-4 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                <span className="text-foreground text-[15px] font-semibold tracking-tight sm:text-[16px]">
                  {award.title}
                </span>
              </div>
              <span className="text-foreground/55 text-[13px] tracking-tight">
                {award.issuer}
                <span className="text-foreground/30 mx-2">•</span>
                {award.date}
              </span>
              <p className="text-foreground/70 mt-1 text-[13px] leading-relaxed tracking-tight sm:text-[14px]">
                {award.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
