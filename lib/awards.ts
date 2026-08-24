import { person } from "@/lib/person";

/**
 * Matches blog post tags against award issuers so posts can link to the
 * relevant Certification/letter automatically — tag a post "StartupTN" and
 * it picks up the StartupTN award with no per-post wiring.
 */
export function getRelatedAwards(tags: string[]) {
  return person.awards
    .map((award, index) => ({ award, index }))
    .filter(({ award }) =>
      tags.some((tag) => award.issuer.toLowerCase().includes(tag.toLowerCase()))
    );
}
