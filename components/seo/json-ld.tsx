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
  const { company } = person;
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: company.name,
    legalName: company.name,
    url: company.url,
    description: company.description,
    foundingDate: company.foundingDate,
    founder: { "@id": PERSON_ID },
    logo: {
      "@type": "ImageObject",
      "@id": `${company.url}/#logo`,
      url: `${siteConfig.url}${company.logo}`,
      contentUrl: `${siteConfig.url}${company.logo}`,
    },
    image: `${siteConfig.url}${company.logo}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.addressLocality,
      addressRegion: company.addressRegion,
      addressCountry: company.addressCountry,
    },
    areaServed: "Worldwide",
    knowsAbout: person.knowsAbout,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: person.email,
      availableLanguage: person.languages,
    },
    makesOffer: company.services.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, provider: { "@id": ORG_ID } },
    })),
    sameAs: [company.url, company.github],
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
    disambiguatingDescription: `Director, ${person.company.role} of ${person.company.name}`,
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
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Film Director",
        occupationLocation: { "@type": "City", name: "Chennai" },
        description:
          "Director and writer of the short films Neram and Number Thaan Kaasu.",
      },
      {
        "@type": "Occupation",
        name: person.company.role,
        occupationLocation: { "@type": "City", name: "Chennai" },
        skills: person.skills.join(", "),
      },
      {
        "@type": "Occupation",
        name: "Full Stack Developer",
        occupationLocation: { "@type": "City", name: "Chennai" },
        skills: person.skills.join(", "),
      },
    ],
    birthDate: person.birthDate,
    birthPlace: {
      "@type": "Place",
      name: person.birthPlace,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Elavur",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
    affiliation: { "@id": ORG_ID },
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
    // The home page is the one canonical profile page. Plain URL (not an @id
    // that only exists on `/`) so this node resolves on every page it's in.
    mainEntityOfPage: `${siteConfig.url}/`,
    sameAs: [
      person.links.github,
      person.links.linkedin,
      person.links.youtube,
      person.links.imdb,
      person.links.instagram,
      person.links.twitter,
      person.links.dribbble,
      person.links.wikidata,
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
    creator: { "@id": PERSON_ID },
    copyrightHolder: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
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

/**
 * Marks the homepage as the canonical profile page for the Person — the
 * `personSchema()`'s `mainEntityOfPage` points at this one fixed `@id`, so
 * only one page may claim it. Other pages about the Person (e.g. /about)
 * use `aboutPageSchema()` instead, which gets its own `@id` rather than
 * competing for this one with a different `url`.
 */
/** When the site was first published (first commit) — the ProfilePage `dateCreated`. */
const SITE_CREATED = "2026-08-14";

export function profilePageSchema(
  path: string,
  { dateModified }: { dateModified?: Date | string } = {}
) {
  const url = `${siteConfig.url}${path}`;
  const modified = dateModified
    ? new Date(dateModified).toISOString()
    : undefined;
  return {
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#profilepage`,
    url,
    name: `${person.name} — ${person.company.role}`,
    inLanguage: "en",
    dateCreated: SITE_CREATED,
    ...(modified ? { dateModified: modified } : {}),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    // The full Person is repeated here, inside the same JSON-LD block. Google
    // reads each <script> separately, so an `@id`-only pointer to the Person in
    // the layout's block leaves the ProfilePage with no readable main entity.
    mainEntity: personSchema(),
  };
}

/** The /about page's own WebPage node — distinct from the homepage's ProfilePage `@id` so the two pages don't assert conflicting `url`s for the same entity. */
export function aboutPageSchema() {
  const url = `${siteConfig.url}/about`;
  return {
    "@type": ["WebPage", "AboutPage"],
    "@id": `${url}#webpage`,
    url,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${person.portraitSrc}`,
    },
    significantLink: [
      person.links.imdb,
      person.links.linkedin,
      person.links.github,
      person.links.youtube,
      person.company.url,
    ],
    name: `About — ${person.name}`,
    description: person.bio,
    inLanguage: "en",
    breadcrumb: { "@id": `${url}#breadcrumb` },
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  const last = items[items.length - 1];
  return {
    "@type": "BreadcrumbList",
    ...(last ? { "@id": `${siteConfig.url}${last.path}#breadcrumb` } : {}),
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
  /** Detail-page URL on this site (not the live product URL). */
  pageUrl?: string;
  codeRepository?: string;
  programmingLanguage?: string;
  /** "design" (Dribbble UI shots) gets CreativeWork instead of SoftwareApplication/SoftwareSourceCode. */
  kind?: "software" | "design";
  applicationCategory?: string;
  operatingSystem?: string;
  /** A merged-PR contribution to someone else's repo — credited as `contributor`, never `author`. */
  isContribution?: boolean;
};

/**
 * Every project is credited to both the Person and the Organization he
 * founded — these are agency/product-studio builds, not solo side projects,
 * so `author`/`creator` name both entities rather than just the individual.
 */
const PROJECT_CREATORS = [{ "@id": PERSON_ID }, { "@id": ORG_ID }];

/** Maps a platform to the most specific schema.org software type Google understands. */
function softwareType(
  operatingSystem?: string
): "MobileApplication" | "WebApplication" | "SoftwareApplication" {
  const os = operatingSystem?.toLowerCase();
  if (os === "android" || os === "ios") return "MobileApplication";
  if (os === "web") return "WebApplication";
  return "SoftwareApplication";
}

/** Credit fields: full authorship for his own work, `contributor` for merged PRs into other people's repos. */
function creditFields(isContribution?: boolean) {
  return isContribution
    ? { contributor: { "@id": PERSON_ID } }
    : { author: PROJECT_CREATORS, creator: PROJECT_CREATORS };
}

/**
 * One node per project, credited to Person + Organization. When `pageUrl` is
 * known, each node reuses the `@id` of the matching node on that project's
 * detail page, so the list and the detail page describe one entity.
 */
export function projectsSchema(projects: ProjectSchemaInput[]) {
  return {
    "@type": "ItemList",
    "@id": `${siteConfig.url}/projects#projects`,
    numberOfItems: projects.length,
    // Plain links only (position + name + url). Typed nested entities here are
    // validated by Google as standalone items, and a stub app/software node
    // fails its required fields — the full node lives on each detail page.
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.name,
      url: project.pageUrl ?? project.url,
    })),
  };
}

/** /projects as a CollectionPage whose main entity is the ItemList above. */
export function projectsPageSchema() {
  const url = `${siteConfig.url}/projects`;
  return {
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: `Projects — ${person.name}`,
    description:
      "SaaS platforms, AI products, and mobile apps built by Nitheesh Rajendran.",
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    mainEntity: { "@id": `${url}#projects` },
  };
}

/** Home-page "My apps" list — plain links to each app's detail page, where the full app node lives. */
export function myAppsSchema(
  apps: Array<{ id: string; name: string; description: string }>
) {
  return {
    "@type": "ItemList",
    "@id": `${siteConfig.url}/#my-apps`,
    name: "My apps",
    numberOfItems: apps.length,
    itemListElement: apps.map((app, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: app.name,
      url: `${siteConfig.url}/projects/${app.id}`,
    })),
  };
}

/** Filmography as Movie nodes directed by the Person — corroborates the IMDb sameAs edge with typed entities. */
export function filmographySchema() {
  return person.filmography.map((film) => ({
    "@type": "Movie",
    "@id": `${siteConfig.url}/about#film-${film.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: film.title,
    description: film.description,
    url: film.url,
    sameAs: film.url,
    genre: film.format.split("·").pop()?.trim(),
    ...("year" in film ? { dateCreated: film.year } : {}),
    director: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  }));
}

type ProjectDetailSchemaInput = ProjectSchemaInput & {
  /** Detail-page URL on this site (not the live product URL). */
  pageUrl: string;
  techStack?: string[];
  features?: string[];
  image?: string;
  liveUrl?: string;
  playStoreUrl?: string;
  downloadUrl?: string;
  packageName?: string;
  screenshots?: string[];
  softwareVersion?: string;
  permissions?: string[];
  keywords?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  contentRating?: string;
  lastUpdated?: string;
  downloads?: number;
  rating?: { value: number; count: number };
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
      inLanguage: "en",
      mainEntityOfPage: { "@id": webPageId },
      ...(project.image ? { image: `${siteConfig.url}${project.image}` } : {}),
    };

    const webPage = {
      "@type": "WebPage",
      "@id": webPageId,
      url: project.pageUrl,
      name: project.name,
      description: project.description,
      inLanguage: "en",
      breadcrumb: { "@id": `${project.pageUrl}#breadcrumb` },
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": creativeWorkId },
      mainEntity: { "@id": creativeWorkId },
    };

    return [creativeWork, webPage];
  }

  const softwareId = `${project.pageUrl}#software`;
  const sourceCodeId = `${project.pageUrl}#sourcecode`;

  const storeUrl = project.playStoreUrl ?? project.downloadUrl;
  const sameAs = [
    project.liveUrl,
    project.playStoreUrl,
    project.downloadUrl,
    project.codeRepository,
  ].filter((u): u is string => Boolean(u));
  const imageUrl = project.image
    ? resolveUrl(project.image)
    : undefined;

  /**
   * Only claim an application when the project really has a category or
   * platform. A merged-PR contribution (or a bare repo) is a codebase, not an
   * app Nitheesh ships — those are described by the SoftwareSourceCode node
   * alone, so no made-up category/OS is asserted.
   */
  const isApp =
    !project.isContribution &&
    Boolean(project.applicationCategory ?? project.operatingSystem);
  const mainId =
    isApp || !project.codeRepository ? softwareId : sourceCodeId;

  const softwareApplication = {
    "@type": softwareType(project.operatingSystem),
    "@id": softwareId,
    name: project.name,
    description: project.description,
    url: project.url,
    mainEntityOfPage: { "@id": webPageId },
    ...(project.applicationCategory
      ? { applicationCategory: project.applicationCategory }
      : {}),
    ...(project.operatingSystem
      ? { operatingSystem: project.operatingSystem }
      : {}),
    inLanguage: "en",
    ...creditFields(project.isContribution),
    ...(project.isContribution ? {} : { publisher: { "@id": ORG_ID } }),
    ...(project.codeRepository ? { isBasedOn: { "@id": sourceCodeId } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(storeUrl
      ? {
          installUrl: storeUrl,
          downloadUrl: project.downloadUrl ?? storeUrl,
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: storeUrl,
          },
        }
      : {}),
    ...(project.techStack?.length || project.keywords?.length
      ? {
          keywords: [
            ...(project.keywords ?? []),
            ...(project.techStack ?? []),
          ].join(", "),
        }
      : {}),
    ...(project.softwareVersion
      ? { softwareVersion: project.softwareVersion }
      : {}),
    ...(project.contentRating ? { contentRating: project.contentRating } : {}),
    ...(project.lastUpdated ? { dateModified: project.lastUpdated } : {}),
    ...(project.downloads
      ? {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: { "@type": "DownloadAction" },
            userInteractionCount: project.downloads,
          },
        }
      : {}),
    // Only emitted when a real store rating has been saved — never invented.
    ...(project.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: project.rating.value,
            ratingCount: project.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(project.permissions?.length
      ? { permissions: project.permissions.join(", ") }
      : {}),
    ...(project.features?.length
      ? { featureList: project.features }
      : {}),
    ...(project.packageName
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "Android package name",
            value: project.packageName,
          },
        }
      : {}),
    ...(project.screenshots?.length
      ? {
          screenshot: project.screenshots.map((url) => ({
            "@type": "ImageObject",
            url,
            contentUrl: url,
          })),
          image: imageUrl ?? project.screenshots[0]!,
        }
      : imageUrl
        ? { screenshot: imageUrl, image: imageUrl }
        : {}),
  };

  const webPage = {
    "@type": "WebPage",
    "@id": webPageId,
    url: project.pageUrl,
    name: project.name,
    description: project.description,
    inLanguage: "en",
    breadcrumb: { "@id": `${project.pageUrl}#breadcrumb` },
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": mainId },
    mainEntity: { "@id": mainId },
    ...(imageUrl ? { primaryImageOfPage: { "@type": "ImageObject", url: imageUrl } } : {}),
  };

  const faqPage = project.faqs?.length
    ? {
        "@type": "FAQPage",
        "@id": `${project.pageUrl}#faq`,
        url: project.pageUrl,
        about: { "@id": mainId },
        isPartOf: { "@id": webPageId },
        mainEntity: project.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;
  const extras = faqPage ? [faqPage] : [];

  if (!project.codeRepository) {
    return [softwareApplication, webPage, ...extras];
  }

  const softwareSourceCode = {
    "@type": "SoftwareSourceCode",
    "@id": sourceCodeId,
    name: project.name,
    description: project.description,
    url: project.url,
    codeRepository: project.codeRepository,
    inLanguage: "en",
    ...(mainId === sourceCodeId
      ? { mainEntityOfPage: { "@id": webPageId } }
      : {}),
    ...(project.programmingLanguage
      ? { programmingLanguage: project.programmingLanguage }
      : {}),
    ...creditFields(project.isContribution),
    ...(project.isContribution ? {} : { publisher: { "@id": ORG_ID } }),
  };

  return [
    ...(isApp ? [softwareApplication] : []),
    softwareSourceCode,
    webPage,
    ...extras,
  ];
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
    author: [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: person.name,
        url: siteConfig.url,
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: person.company.name,
        url: person.company.url,
      },
    ],
    // Inline (same @id as the layout's nodes) so name/logo are readable inside
    // this block — Google parses each <script> separately and won't follow a
    // bare @id into the layout's block.
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: person.company.name,
      url: person.company.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${person.company.logo}`,
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
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteConfig.url}/blog#blog`,
      name: `${person.name} — Blog`,
      url: `${siteConfig.url}/blog`,
    },
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

type StoryListSchemaInput = {
  slug: string;
  title: string;
  posterImage: string;
  datePublished: string;
};

/**
 * Web Stories listing page — an ItemList whose Article nodes share the same
 * `@id` as the Article JSON-LD each AMP story page (lib/amp-story-html.ts)
 * already emits, so both pages describe one consistent entity instead of
 * two disconnected ones.
 */
export function storiesListSchema(stories: StoryListSchemaInput[]) {
  return {
    "@type": "ItemList",
    "@id": `${siteConfig.url}/stories#stories`,
    itemListElement: stories.map((story, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        "@id": `${siteConfig.url}/stories/${story.slug}#article`,
        headline: story.title,
        image: story.posterImage,
        url: `${siteConfig.url}/stories/${story.slug}`,
        datePublished: story.datePublished,
      },
    })),
  };
}
