import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { PROJECT_CATEGORIES, type Project } from "@/components/projects/projects-data";

function slugifyId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const arr = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  return arr.length ? arr : undefined;
}

export function parseProjectInput(body: Record<string, unknown>): Project | null {
  const { name, category, headline, description, meta, language } = body;

  if (typeof name !== "string" || !name.trim()) return null;
  if (typeof headline !== "string" || !headline.trim()) return null;
  if (typeof description !== "string" || !description.trim()) return null;
  if (typeof meta !== "string" || !meta.trim()) return null;
  if (typeof language !== "string" || !language.trim()) return null;
  if (
    typeof category !== "string" ||
    !(PROJECT_CATEGORIES as readonly string[]).includes(category)
  ) {
    return null;
  }

  const rawId = optionalString(body.id) ?? name;
  const kind = body.kind === "design" ? "design" : body.kind === "software" ? "software" : undefined;

  return {
    id: slugifyId(rawId),
    name: name.trim(),
    iconLabel: optionalString(body.iconLabel) ?? name.trim(),
    category: category as Project["category"],
    headline: headline.trim(),
    description: description.trim(),
    meta: meta.trim(),
    language: language.trim(),
    ...(optionalString(body.githubUrl) ? { githubUrl: optionalString(body.githubUrl) } : {}),
    ...(optionalString(body.liveUrl) ? { liveUrl: optionalString(body.liveUrl) } : {}),
    ...(optionalString(body.playStoreUrl) ? { playStoreUrl: optionalString(body.playStoreUrl) } : {}),
    ...(optionalString(body.dribbbleUrl) ? { dribbbleUrl: optionalString(body.dribbbleUrl) } : {}),
    ...(optionalString(body.image) ? { image: optionalString(body.image) } : {}),
    ...(optionalString(body.imageAlt) ? { imageAlt: optionalString(body.imageAlt) } : {}),
    ...(optionalString(body.logo) ? { logo: optionalString(body.logo) } : {}),
    ...(body.logoIsDark === true ? { logoIsDark: true } : {}),
    ...(optionalString(body.gradient) ? { gradient: optionalString(body.gradient) } : {}),
    ...(stringArray(body.techStack) ? { techStack: stringArray(body.techStack) } : {}),
    ...(stringArray(body.features) ? { features: stringArray(body.features) } : {}),
    ...(kind ? { kind } : {}),
    ...(optionalString(body.applicationCategory)
      ? { applicationCategory: optionalString(body.applicationCategory) }
      : {}),
    ...(optionalString(body.operatingSystem)
      ? { operatingSystem: optionalString(body.operatingSystem) }
      : {}),
  } as Project;
}

export type ProjectInput = Project;

type ProjectDoc = Project & {
  _id: ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectRecord = Project & {
  mongoId: string;
  order: number;
};

const COLLECTION = "projects";

async function getCollection() {
  const db = await getDb();
  return db.collection<ProjectDoc>(COLLECTION);
}

function toProjectRecord(doc: ProjectDoc): ProjectRecord {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, order, createdAt, updatedAt, ...project } = doc;
  return { ...project, mongoId: _id.toString(), order };
}

export async function getAllProjects(): Promise<ProjectRecord[]> {
  const collection = await getCollection();
  const docs = await collection.find().sort({ order: 1 }).toArray();
  return docs.map(toProjectRecord);
}

export async function getProjectBySlug(id: string): Promise<ProjectRecord | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ id });
  return doc ? toProjectRecord(doc) : null;
}

export async function getProjectByMongoId(
  mongoId: string
): Promise<ProjectRecord | null> {
  if (!ObjectId.isValid(mongoId)) return null;
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(mongoId) });
  return doc ? toProjectRecord(doc) : null;
}

export async function isProjectSlugTaken(
  id: string,
  excludeMongoId?: string
): Promise<boolean> {
  const collection = await getCollection();
  const filter: Record<string, unknown> = { id };
  if (excludeMongoId && ObjectId.isValid(excludeMongoId)) {
    filter._id = { $ne: new ObjectId(excludeMongoId) };
  }
  const existing = await collection.findOne(filter);
  return existing !== null;
}

export async function createProject(input: ProjectInput): Promise<ProjectRecord> {
  const collection = await getCollection();
  const now = new Date();
  const highest = await collection.find().sort({ order: -1 }).limit(1).toArray();
  const order = (highest[0]?.order ?? -1) + 1;

  const doc: Omit<ProjectDoc, "_id"> = { ...input, order, createdAt: now, updatedAt: now };
  const result = await collection.insertOne(doc as ProjectDoc);
  return toProjectRecord({ ...doc, _id: result.insertedId } as ProjectDoc);
}

export async function updateProject(
  mongoId: string,
  input: ProjectInput
): Promise<ProjectRecord | null> {
  if (!ObjectId.isValid(mongoId)) return null;
  const collection = await getCollection();
  await collection.updateOne(
    { _id: new ObjectId(mongoId) },
    { $set: { ...input, updatedAt: new Date() } }
  );
  const updated = await collection.findOne({ _id: new ObjectId(mongoId) });
  return updated ? toProjectRecord(updated) : null;
}

export async function deleteProject(mongoId: string): Promise<boolean> {
  if (!ObjectId.isValid(mongoId)) return false;
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(mongoId) });
  return result.deletedCount > 0;
}
