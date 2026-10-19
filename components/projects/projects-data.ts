export const PROJECT_CATEGORIES = [
  "Web Development",
  "App Development",
  "UI/UX Design",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type ProjectPullRequest = {
  title: string;
  url: string;
  number: number;
};

export type ProjectFaq = {
  question: string;
  answer: string;
};

/**
 * Shape of a project. Projects themselves are not defined in code — they live
 * in the MongoDB `projects` collection (see lib/projects-db.ts) and are edited
 * from the admin panel.
 */
export type Project = {
  id: string;
  name: string;
  iconLabel: string;
  /** "Open Source" is a live-generated GitHub category (see lib/open-source.ts) shown in its own
   * separate section, not a filterable tab — so it's excluded from PROJECT_CATEGORIES. */
  category: ProjectCategory | "Open Source";
  headline: string;
  description: string;
  meta: string;
  githubUrl?: string;
  liveUrl?: string;
  playStoreUrl?: string;
  /** Direct download link (e.g. a GitHub release APK) for apps not on a store. */
  downloadUrl?: string;
  /** Dribbble shot URL — used for UI/UX design pieces instead of code/store links. */
  dribbbleUrl?: string;
  language: string;
  /** Screenshot, when one exists that's safe to publish (no third-party client data). */
  image?: string;
  imageAlt?: string;
  /** Local brand mark shown on the gradient placeholder when there's no screenshot. */
  logo?: string;
  logoIsDark?: boolean;
  /** Placeholder gradient, used when `image` is absent. */
  gradient?: string;
  /** Shown on the project detail page only. */
  techStack?: string[];
  features?: string[];
  /** Merged PRs for an open-source contribution — rendered as hyperlinks on the detail page instead of plain feature bullets. */
  pullRequests?: ProjectPullRequest[];
  /**
   * "design" pieces (Dribbble shots) get CreativeWork JSON-LD instead of
   * SoftwareApplication — they're visual design work, not shipped software.
   * Defaults to "software" when omitted.
   */
  kind?: "software" | "design";
  /** schema.org SoftwareApplication.applicationCategory, e.g. "BusinessApplication". Software projects only. */
  applicationCategory?: string;
  /** schema.org SoftwareApplication.operatingSystem, e.g. "Web" or "Android". Software projects only. */
  operatingSystem?: string;
  /** Shown in the "My apps" section instead of the main projects carousel. */
  featuredApp?: boolean;
  /** Android package name / Play Store id, e.g. "com.setupsworks.aiexpensetracker". */
  packageName?: string;
  /** Store screenshots (full image URLs), shown as a gallery on the detail page. */
  screenshots?: string[];
  /** Current app version, e.g. "3.5.2". */
  softwareVersion?: string;
  /** Human-readable Android permissions the app requests. */
  permissions?: string[];
  /** Search keywords for this page's <meta keywords> and schema. */
  keywords?: string[];
  /** Store content rating, e.g. "Rated for 3+". */
  contentRating?: string;
  /** Store "last updated" date, ISO yyyy-mm-dd. */
  lastUpdated?: string;
  /** Store download count (lower bound, e.g. 50 for "50+"). */
  downloads?: number;
  /** Real store rating — leave unset until the app has one; it drives aggregateRating schema. */
  rating?: { value: number; count: number };
  /** Real questions people ask about the project — rendered on the page and as FAQPage schema. */
  faqs?: ProjectFaq[];
};

const SCREENSHOT_RATIO = 2560 / 1600;

export { SCREENSHOT_RATIO };
