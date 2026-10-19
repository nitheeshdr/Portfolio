import type { Project } from "@/components/projects/projects-data";
import { getPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/metadata";
import { getOpenSourceProjects } from "@/lib/open-source";
import { person } from "@/lib/person";
import { getAllProjects } from "@/lib/projects-db";
import { getPublishedStories } from "@/lib/web-stories";

const base = siteConfig.url;

function pageUrl(project: Project): string {
  return `${base}/projects/${project.id}`;
}

/** One project as a markdown list item; `full` adds the stack, features and store details. */
function projectLine(project: Project, full: boolean): string {
  const links = [
    project.liveUrl && `[live](${project.liveUrl})`,
    project.playStoreUrl && `[Google Play](${project.playStoreUrl})`,
    project.downloadUrl && `[download](${project.downloadUrl})`,
    project.githubUrl && `[code](${project.githubUrl})`,
    project.dribbbleUrl && `[Dribbble](${project.dribbbleUrl})`,
  ].filter(Boolean);

  const head = `- [${project.name}](${pageUrl(project)}): ${project.headline}${
    links.length ? ` (${links.join(", ")})` : ""
  }`;
  if (!full) return head;

  const details = [
    `  - ${project.description}`,
    project.packageName && `  - Android package: ${project.packageName}`,
    project.softwareVersion && `  - Version: ${project.softwareVersion}`,
    project.techStack?.length && `  - Built with: ${project.techStack.join(", ")}`,
    project.features?.length &&
      `  - Features: ${project.features.join("; ")}`,
  ].filter(Boolean);
  return [head, ...details].join("\n");
}

function section(title: string, lines: string[]): string {
  return lines.length ? `## ${title}\n\n${lines.join("\n")}\n` : "";
}

/**
 * Builds /llms.txt (concise index) or /llms-full.txt (adds descriptions, stacks
 * and features) from the same data the site renders — MongoDB projects, blog
 * posts, stories and the GitHub-sourced contributions — plus the identity data
 * in lib/person.ts. Nothing here is hand-maintained, so it can't go stale.
 */
export async function buildLlmsTxt({ full }: { full: boolean }): Promise<string> {
  const [projects, posts, stories, contributions] = await Promise.all([
    getAllProjects(),
    getPublishedPosts(),
    getPublishedStories(),
    getOpenSourceProjects().catch(() => []),
  ]);

  const isApp = (p: Project) => p.featuredApp || p.category === "App Development";
  const web = projects.filter((p) => !isApp(p) && p.category === "Web Development");
  const apps = projects.filter(isApp);
  const design = projects.filter((p) => !isApp(p) && p.category === "UI/UX Design");

  const edu = person.education;
  const parts = [
    `# ${person.name}\n`,
    `> ${person.bio}\n`,
    `${person.name} (also written ${person.alternateNames.slice(0, 3).join(", ")}) is based in ${person.location}. ${person.summary}\n`,
    section("Pages", [
      `- [Home](${base}/): Introduction, featured projects, apps and contact.`,
      `- [About](${base}/about): Background, experience, education, filmography, skills and awards.`,
      `- [Projects](${base}/projects): Shipped SaaS platforms, AI products, mobile apps and UI/UX design work.`,
      `- [Blog](${base}/blog): Writing on software engineering, AI products and security.`,
      `- [Web Stories](${base}/stories): Short, swipeable visual stories.`,
    ]),
    section("Web & AI products", web.map((p) => projectLine(p, full))),
    section("Mobile apps", apps.map((p) => projectLine(p, full))),
    section("UI/UX design", design.map((p) => projectLine(p, full))),
    section(
      "Open source contributions",
      contributions.map(
        (p) =>
          `- [${p.name}](${pageUrl(p)}): ${p.headline}${
            p.githubUrl ? ` ([repo](${p.githubUrl}))` : ""
          }`
      )
    ),
    section(
      "Blog",
      posts.map((post) => `- [${post.title}](${base}/blog/${post.slug}): ${post.excerpt}`)
    ),
    section(
      "Background",
      [
        `- Company: ${person.company.role} of [${person.company.name}](${person.company.url}) (${person.company.period}) — ${person.company.description}`,
        `- Education: ${edu.degree}, ${edu.school} (${edu.alternateName}), ${edu.period}.`,
        `- Born: ${person.birthDate}, ${person.birthPlace}.`,
        ...person.awards.map(
          (a) => `- Award: ${a.title} — ${a.issuer}, ${a.date}. ${a.description}`
        ),
        ...person.filmography.map(
          (f) => `- Film: [${f.title}](${f.url}) — ${f.role}; ${f.format}. ${f.description}`
        ),
        `- Languages: ${person.languages.join(", ")}.`,
        `- Skills: ${person.skills.join(", ")}.`,
      ]
    ),
    section("Contact & profiles", [
      `- Email: ${person.email}`,
      ...Object.entries(person.links)
        .filter(([key]) => key !== "website")
        .map(([key, url]) => `- [${key[0]!.toUpperCase()}${key.slice(1)}](${url})`),
    ]),
    section(
      "Optional",
      stories.map((s) => `- [${s.title}](${base}/stories/${s.slug}): Web Story.`)
    ),
  ];

  return parts.filter(Boolean).join("\n").trimEnd() + "\n";
}

/** Plain-text response with a short cache so edits in the admin show up within the hour. */
export function textResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
