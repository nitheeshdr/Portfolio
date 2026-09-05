import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type WebStoryPage = {
  image: string;
  imageAlt: string;
  heading: string;
  text: string;
};

export type WebStory = {
  id: string;
  title: string;
  slug: string;
  posterImage: string;
  pages: WebStoryPage[];
  ctaLabel: string;
  ctaUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type WebStoryInput = {
  title: string;
  slug: string;
  posterImage: string;
  pages: WebStoryPage[];
  ctaLabel: string;
  ctaUrl: string;
  published: boolean;
};

type WebStoryDoc = {
  _id: ObjectId;
  title: string;
  slug: string;
  posterImage: string;
  pages: WebStoryPage[];
  ctaLabel: string;
  ctaUrl: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

const COLLECTION = "web_stories";

async function getCollection() {
  const db = await getDb();
  return db.collection<WebStoryDoc>(COLLECTION);
}

function toWebStory(doc: WebStoryDoc): WebStory {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    posterImage: doc.posterImage,
    pages: doc.pages,
    ctaLabel: doc.ctaLabel,
    ctaUrl: doc.ctaUrl,
    published: doc.published,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function pagesArray(value: unknown): WebStoryPage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (v): v is Record<string, unknown> => typeof v === "object" && v !== null
    )
    .map((v) => ({
      image: typeof v.image === "string" ? v.image.trim() : "",
      imageAlt: typeof v.imageAlt === "string" ? v.imageAlt.trim() : "",
      heading: typeof v.heading === "string" ? v.heading.trim() : "",
      text: typeof v.text === "string" ? v.text.trim() : "",
    }))
    .filter((page) => page.image.length > 0);
}

export async function getAllStories(): Promise<WebStory[]> {
  const collection = await getCollection();
  const docs = await collection.find().sort({ createdAt: -1 }).toArray();
  return docs.map(toWebStory);
}

export async function getPublishedStories(): Promise<WebStory[]> {
  const collection = await getCollection();
  const docs = await collection
    .find({ published: true })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map(toWebStory);
}

export async function getStoryBySlug(slug: string): Promise<WebStory | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ slug });
  return doc ? toWebStory(doc) : null;
}

export async function getStoryById(id: string): Promise<WebStory | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? toWebStory(doc) : null;
}

export async function isSlugTaken(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const collection = await getCollection();
  const filter: Record<string, unknown> = { slug };
  if (excludeId && ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new ObjectId(excludeId) };
  }
  const existing = await collection.findOne(filter);
  return existing !== null;
}

export async function createStory(input: WebStoryInput): Promise<WebStory> {
  const collection = await getCollection();
  const now = new Date();
  const doc: Omit<WebStoryDoc, "_id"> = {
    ...input,
    createdAt: now,
    updatedAt: now,
    publishedAt: input.published ? now : null,
  };
  const result = await collection.insertOne(doc as WebStoryDoc);
  return toWebStory({ ...doc, _id: result.insertedId } as WebStoryDoc);
}

export async function updateStory(
  id: string,
  input: WebStoryInput
): Promise<WebStory | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getCollection();
  const existing = await collection.findOne({ _id: new ObjectId(id) });
  if (!existing) return null;

  const now = new Date();
  const publishedAt =
    input.published && !existing.published
      ? now
      : input.published
        ? existing.publishedAt
        : null;

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...input, updatedAt: now, publishedAt } }
  );

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return updated ? toWebStory(updated) : null;
}

export function parseWebStoryInput(
  body: Record<string, unknown>
): WebStoryInput | null {
  const { title, slug, posterImage } = body;
  if (typeof title !== "string" || !title.trim()) return null;
  if (typeof posterImage !== "string" || !posterImage.trim()) return null;

  const pages = pagesArray(body.pages);
  if (pages.length === 0) return null;

  const ctaLabel = optionalString(body.ctaLabel);
  const ctaUrl = optionalString(body.ctaUrl);

  return {
    title: title.trim(),
    slug: slugify(typeof slug === "string" && slug.trim() ? slug : title),
    posterImage: posterImage.trim(),
    pages,
    // Both or neither — a lone label/url isn't a usable CTA.
    ctaLabel: ctaLabel && ctaUrl ? ctaLabel : "",
    ctaUrl: ctaLabel && ctaUrl ? ctaUrl : "",
    published: body.published === true,
  };
}

export async function deleteStory(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
