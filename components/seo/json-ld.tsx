import type { ReactNode } from "react";
import { person } from "@/lib/person";
import { siteConfig } from "@/lib/metadata";

const PERSON_ID = `${siteConfig.url}/#person`;
const ORG_ID = `${person.company.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/**
 * Renders one or more JSON-LD graphs as a script tag. Kept as a single
 * `@graph` per page so every node on that page shares one `@context` and can
 * reference siblings by `@id` (Person <-> Organization <-> WebPage).
 */
export function JsonLd({ items }: { items: object[] }): ReactNode {
  const json = {
    "@context": "https://schema.org",
    "@graph": items,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

/** The organization the Person works for — corroborates the employment edge in both directions. */
export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: person.company.name,
    url: person.company.url,
    description: person.company.description,
    founder: { "@id": PERSON_ID },
    sameAs: [person.company.url],
  };
}

/**
 * The Person node — the entity Google's Knowledge Panel resolves against.
 * Alternate names, alumni identifiers, and the knowledge-panel share link
 * are all included so this page reconciles with the existing panel rather
 * than creating a second, competing entity.
 */
export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    alternateName: person.alternateNames,
    givenName: person.givenName,
    familyName: person.familyName,
    jobTitle: person.jobTitles,
    description: person.bio,
    url: siteConfig.url,
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${person.portraitSrc}`,
      width: 1500,
      height: 1500,
    },
    worksFor: { "@id": ORG_ID },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: person.education.school,
      alternateName: person.education.alternateName,
      url: person.education.url,
      sameAs: person.education.sameAs,
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      educationalLevel: "Bachelor's degree",
      about: person.education.degree,
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: person.education.school,
        url: person.education.url,
        sameAs: person.education.sameAs,
      },
    },
    hasOccupation: {
      "@type": "Occupation",
      name: person.company.role,
      occupationLocation: { "@type": "City", name: "Chennai" },
      skills: person.skills.join(", "),
    },
    homeLocation: { "@type": "Place", name: person.homeLocation },
    workLocation: { "@type": "Place", name: person.location },
    nationality: { "@type": "Country", name: "India" },
    knowsLanguage: person.languages.map((name) => ({
      "@type": "Language",
      name,
    })),
    knowsAbout: person.knowsAbout,
    email: `mailto:${person.email}`,
    /**
     * Family relationships — schema.org Person.parent / Person.sibling.
     * Corroborates the Person entity for Knowledge Graph reconciliation the
     * same way alumniOf and worksFor do: named relationships, not just text.
     */
    parent: [
      { "@type": "Person", name: person.family.father },
      { "@type": "Person", name: person.family.mother },
    ],
    sibling: person.family.siblings.map((name) => ({
      "@type": "Person",
      name,
    })),
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Wikidata",
      value: person.identifiers.wikidataId,
      url: person.links.wikidata,
    },
    mainEntityOfPage: { "@id": `${siteConfig.url}/#profilepage` },
    sameAs: [
      person.links.github,
      person.links.linkedin,
      person.links.youtube,
      person.links.imdb,
      person.links.instagram,
      person.links.wikidata,
      person.links.knowledgePanel,
      person.links.crunchbase,
    ],
  };
}

/** WebSite node — publisher points at the Person, since this is his personal site. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
    hasPart: SITE_NAV_ITEMS.map((item) => ({
      "@id": `${siteConfig.url}${item.path}#navitem`,
    })),
  };
}

const SITE_NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
] as const;

/**
 * SiteNavigationElement nodes for the primary nav — a signal (not a
 * guarantee) that helps Google generate sitelinks under the search result.
 * Sitelinks themselves are algorithmic; this just states the site's main
 * sections explicitly rather than leaving them to be inferred from the DOM.
 */
export function siteNavigationSchema() {
  return SITE_NAV_ITEMS.map((item) => ({
    "@type": "SiteNavigationElement",
    "@id": `${siteConfig.url}${item.path}#navitem`,
    name: item.name,
    url: `${siteConfig.url}${item.path}`,
  }));
}

/** Marks a page as the profile page for the Person, e.g. the homepage or /about. */
export function profilePageSchema(path: string) {
  const url = `${siteConfig.url}${path}`;
  return {
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#profilepage`,
    url,
    name: `${person.name} — ${person.company.role}`,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

type ProjectSchemaInput = {
  name: string;
  description: string;
  url: string;
  codeRepository?: string;
  programmingLanguage?: string;
};

/**
 * Every project is credited to both the Person and the Organization he
 * founded — these are agency/product-studio builds, not solo side projects,
 * so `author`/`creator` name both entities rather than just the individual.
 */
const PROJECT_CREATORS = [{ "@id": PERSON_ID }, { "@id": ORG_ID }];

/** One SoftwareSourceCode node per shipped project, credited to Person + Organization. */
export function projectsSchema(projects: ProjectSchemaInput[]) {
  return {
    "@type": "ItemList",
    "@id": `${siteConfig.url}/projects#projects`,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": project.codeRepository ? "SoftwareSourceCode" : "SoftwareApplication",
        name: project.name,
        description: project.description,
        url: project.url,
        ...(project.codeRepository
          ? { codeRepository: project.codeRepository }
          : {}),
        ...(project.programmingLanguage
          ? { programmingLanguage: project.programmingLanguage }
          : {}),
        author: PROJECT_CREATORS,
        creator: PROJECT_CREATORS,
      },
    })),
  };
}

type ProjectDetailSchemaInput = ProjectSchemaInput & {
  /** Detail-page URL on this site (not the live product URL). */
  pageUrl: string;
  applicationCategory: string;
  operatingSystem: string;
  techStack?: string[];
  features?: string[];
  image?: string;
};

/**
 * Full detail-page schema for one project: a SoftwareApplication node (the
 * rich-result type Google actually recognizes for apps/products, carrying
 * category, OS, and feature data) plus the SoftwareSourceCode node linked
 * via `isBasedOn`, and a WebPage wrapper tying the page itself to both.
 * Both nodes credit the Person and the Organization he founded.
 */
export function projectDetailSchema(project: ProjectDetailSchemaInput) {
  const softwareId = `${project.pageUrl}#software`;
  const sourceCodeId = `${project.pageUrl}#sourcecode`;
  const webPageId = `${project.pageUrl}#webpage`;

  const softwareApplication = {
    "@type": "SoftwareApplication",
    "@id": softwareId,
    name: project.name,
    description: project.description,
    url: project.url,
    applicationCategory: project.applicationCategory,
    operatingSystem: project.operatingSystem,
    author: PROJECT_CREATORS,
    creator: PROJECT_CREATORS,
    publisher: { "@id": ORG_ID },
    ...(project.codeRepository ? { isBasedOn: { "@id": sourceCodeId } } : {}),
    ...(project.techStack?.length ? { keywords: project.techStack.join(", ") } : {}),
    ...(project.features?.length ? { featureList: project.features.join(", ") } : {}),
    ...(project.image
      ? { screenshot: `${siteConfig.url}${project.image}`, image: `${siteConfig.url}${project.image}` }
      : {}),
  };

  const webPage = {
    "@type": "WebPage",
    "@id": webPageId,
    url: project.pageUrl,
    name: project.name,
    description: project.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": softwareId },
    mainEntity: { "@id": softwareId },
  };

  if (!project.codeRepository) {
    return [softwareApplication, webPage];
  }

  const softwareSourceCode = {
    "@type": "SoftwareSourceCode",
    "@id": sourceCodeId,
    name: project.name,
    description: project.description,
    codeRepository: project.codeRepository,
    ...(project.programmingLanguage
      ? { programmingLanguage: project.programmingLanguage }
      : {}),
    author: PROJECT_CREATORS,
    creator: PROJECT_CREATORS,
  };

  return [softwareApplication, softwareSourceCode, webPage];
}
