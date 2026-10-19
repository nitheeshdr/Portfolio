import type { Project } from "@/components/projects/projects-data";
import { getAllProjects } from "@/lib/projects-db";

/** True when a project is flagged `featuredApp` in MongoDB, so the main projects carousel can skip it. */
export function isMyApp(project: { featuredApp?: boolean }): boolean {
  return project.featuredApp === true;
}

type ReleaseResponse = {
  html_url: string;
  assets?: { name: string; browser_download_url: string }[];
};

/** Latest GitHub release APK (or release page) for a repo URL — only used to fill a missing downloadUrl. */
async function latestReleaseUrl(githubUrl: string): Promise<string | null> {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!match) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${match[1]}/${match[2]}/releases/latest`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "nitheeshdr.in",
        },
      }
    );
    if (!res.ok) return null;
    const release = (await res.json()) as ReleaseResponse;
    const apk = release.assets?.find((a) => a.name.endsWith(".apk"));
    return apk?.browser_download_url ?? release.html_url;
  } catch {
    return null;
  }
}

/**
 * Projects flagged `featuredApp` in MongoDB, in their saved order. Everything
 * shown comes from the database record; GitHub is only asked for the latest
 * release link when a record has a repo but no download URL of its own.
 */
export async function getMyApps(): Promise<Project[]> {
  const projects = await getAllProjects().catch(() => []);

  return Promise.all(
    projects.filter(isMyApp).map(async (project): Promise<Project> => {
      if (project.downloadUrl || project.playStoreUrl || !project.githubUrl) {
        return project;
      }
      const downloadUrl = await latestReleaseUrl(project.githubUrl);
      return downloadUrl ? { ...project, downloadUrl } : project;
    })
  );
}
