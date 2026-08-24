import type { ReactNode } from "react";
import { person } from "@/lib/person";
import { getRelatedAwards } from "@/lib/awards";
import { siteConfig } from "@/lib/metadata";

/** Resolves a root-relative path against the site origin; leaves an already-absolute URL (e.g. Cloudinary) untouched. */
function resolveUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${siteConfig.url}${path}`;
}

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
    /**
     * Subtitle-style disambiguation text (distinct from the full `description`
     * bio) — the closest schema.org lever to a Knowledge Panel subtitle.
     * Google's "suggest an edit" form only accepts factual corrections, not
     * custom subtitle text; this is the structured-data path instead.
     */
    disambiguatingDescription: `${person.company.role} of ${person.company.name}`,
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
    hasCredential: [
      {
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
      ...person.awards.map((a, i) => ({
        "@type": "Certification" as const,
        "@id": `${siteConfig.url}/about#award-${i}`,
        name: a.title,
        about: "Responsible security disclosure",
        dateCreated: a.dateISO,
        image: resolveUrl(a.image),
        url: `${siteConfig.url}/about#awards`,
        issuedBy: {
          "@type": "GovernmentOrganization",
          name: a.issuer,
          url: a.issuerUrl,
          logo: resolveUrl(a.issuerLogo),
        },
      })),
    ],
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
    award: person.awards.map((a) => `${a.title} — ${a.issuer} (${a.date})`),
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
  { name: "Blog", path: "/blog" },
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

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
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
  /** "design" (Dribbble UI shots) gets CreativeWork instead of SoftwareApplication/SoftwareSourceCode. */
  kind?: "software" | "design";
};

/**
 * Every project is credited to both the Person and the Organization he
 * founded — these are agency/product-studio builds, not solo side projects,
 * so `author`/`creator` name both entities rather than just the individual.
 */
const PROJECT_CREATORS = [{ "@id": PERSON_ID }, { "@id": ORG_ID }];

/** One SoftwareSourceCode/CreativeWork node per project, credited to Person + Organization. */
export function projectsSchema(projects: ProjectSchemaInput[]) {
  return {
    "@type": "ItemList",
    "@id": `${siteConfig.url}/projects#projects`,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type":
          project.kind === "design"
            ? "CreativeWork"
            : project.codeRepository
              ? "SoftwareSourceCode"
              : "SoftwareApplication",
        name: project.name,
        description: project.description,
        url: project.url,
        ...(project.kind === "design"
          ? { genre: "User Interface Design" }
          : {}),
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
  /** Required for "software" kind (the default); unused for "design". */
  applicationCategory?: string;
  operatingSystem?: string;
  techStack?: string[];
  features?: string[];
  image?: string;
};

/**
 * Full detail-page schema for one project. Design pieces (kind: "design",
 * Dribbble shots) get a CreativeWork node — they're visual design work, not
 * shipped software, so SoftwareApplication would misrepresent them. Software
 * projects get a SoftwareApplication node (the rich-result type Google
 * recognizes for apps/products) plus a SoftwareSourceCode node linked via
 * `isBasedOn` when a repo exists. Both cases get a WebPage wrapper, and both
 * credit the Person and the Organization he founded.
 */
export function projectDetailSchema(project: ProjectDetailSchemaInput) {
  const webPageId = `${project.pageUrl}#webpage`;

  if (project.kind === "design") {
    const creativeWorkId = `${project.pageUrl}#creativework`;

    const creativeWork = {
      "@type": "CreativeWork",
      "@id": creativeWorkId,
      name: project.name,
      description: project.description,
      url: project.url,
      genre: "User Interface Design",
      author: PROJECT_CREATORS,
      creator: PROJECT_CREATORS,
      publisher: { "@id": ORG_ID },
      ...(project.image ? { image: `${siteConfig.url}${project.image}` } : {}),
    };

    const webPage = {
      "@type": "WebPage",
      "@id": webPageId,
      url: project.pageUrl,
      name: project.name,
      description: project.description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": creativeWorkId },
      mainEntity: { "@id": creativeWorkId },
    };

    return [creativeWork, webPage];
  }

  const softwareId = `${project.pageUrl}#software`;
  const sourceCodeId = `${project.pageUrl}#sourcecode`;

  const softwareApplication = {
    "@type": "SoftwareApplication",
    "@id": softwareId,
    name: project.name,
    description: project.description,
    url: project.url,
    applicationCategory: project.applicationCategory ?? "WebApplication",
    operatingSystem: project.operatingSystem ?? "Web",
    author: PROJECT_CREATORS,
    creator: PROJECT_CREATORS,
    publisher: { "@id": ORG_ID },
    ...(project.codeRepository ? { isBasedOn: { "@id": sourceCodeId } } : {}),
    ...(project.techStack?.length
      ? { keywords: project.techStack.join(", ") }
      : {}),
    ...(project.features?.length
      ? { featureList: project.features.join(", ") }
      : {}),
    ...(project.image
      ? {
          screenshot: `${siteConfig.url}${project.image}`,
          image: `${siteConfig.url}${project.image}`,
        }
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

type BlogPostSchemaInput = {
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  datePublished: string;
  dateModified: string;
  tags: string[];
};

/** Full detail-page schema for one blog post: a BlogPosting node plus the WebPage wrapper. */
export function blogPostSchema(post: BlogPostSchemaInput) {
  const pageUrl = `${siteConfig.url}/blog/${post.slug}`;
  const postId = `${pageUrl}#article`;
  const webPageId = `${pageUrl}#webpage`;

  /**
   * Cross-links this post to a Certification node from personSchema() when a
   * tag matches that award's issuer — e.g. a post tagged "StartupTN" picks up
   * the StartupTN recognition automatically, no per-post wiring needed.
   */
  const relatedAwards = getRelatedAwards(post.tags);

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": postId,
    headline: post.title,
    description: post.excerpt,
    url: pageUrl,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: PROJECT_CREATORS,
    publisher: {
      "@id": ORG_ID,
      "@type": "Organization",
      name: person.company.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/brand/setups-works-mark.png`,
      },
    },
    ...(post.coverImage ? { image: post.coverImage } : {}),
    ...(post.tags.length
      ? { keywords: post.tags, articleSection: post.tags[0] }
      : {}),
    ...(relatedAwards.length
      ? {
          award: relatedAwards.map(({ award }) => award.title),
          mentions: relatedAwards.map(({ index }) => ({
            "@id": `${siteConfig.url}/about#award-${index}`,
          })),
        }
      : {}),
    isPartOf: { "@id": `${siteConfig.url}/blog#blog` },
    mainEntityOfPage: { "@id": webPageId },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": webPageId,
    url: pageUrl,
    name: post.title,
    description: post.excerpt,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": postId },
    mainEntity: { "@id": postId },
  };

  return [blogPosting, webPage];
}

type BlogListSchemaInput = {
  slug: string;
  title: string;
  excerpt: string;
  datePublished: string;
};

/** Blog listing page — a Blog node whose `blogPost` array links out to each BlogPosting's @id. */
export function blogListSchema(posts: BlogListSchemaInput[]) {
  return {
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog#blog`,
    url: `${siteConfig.url}/blog`,
    name: `${person.name} — Blog`,
    publisher: { "@id": ORG_ID },
    author: { "@id": PERSON_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${siteConfig.url}/blog/${post.slug}#article`,
      headline: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      datePublished: post.datePublished,
    })),
  };
}
