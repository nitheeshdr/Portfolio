import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  /** Markdown body. */
  content: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string[];
  published: boolean;
};

type BlogPostDoc = {
  _id: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

const COLLECTION = "blog_posts";

async function getCollection() {
  const db = await getDb();
  return db.collection<BlogPostDoc>(COLLECTION);
}

function toBlogPost(doc: BlogPostDoc): BlogPost {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    coverImage: doc.coverImage,
    content: doc.content,
    tags: doc.tags,
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

export async function getAllPosts(): Promise<BlogPost[]> {
  const collection = await getCollection();
  const docs = await collection.find().sort({ createdAt: -1 }).toArray();
  return docs.map(toBlogPost);
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const collection = await getCollection();
  const docs = await collection
    .find({ published: true })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map(toBlogPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ slug });
  return doc ? toBlogPost(doc) : null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? toBlogPost(doc) : null;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const collection = await getCollection();
  const filter: Record<string, unknown> = { slug };
  if (excludeId && ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new ObjectId(excludeId) };
  }
  const existing = await collection.findOne(filter);
  return existing !== null;
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const collection = await getCollection();
  const now = new Date();
  const doc: Omit<BlogPostDoc, "_id"> = {
    ...input,
    createdAt: now,
    updatedAt: now,
    publishedAt: input.published ? now : null,
  };
  const result = await collection.insertOne(doc as BlogPostDoc);
  return toBlogPost({ ...doc, _id: result.insertedId } as BlogPostDoc);
}

export async function updatePost(
  id: string,
  input: BlogPostInput
): Promise<BlogPost | null> {
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
  return updated ? toBlogPost(updated) : null;
}

export function parseBlogPostInput(body: Record<string, unknown>): BlogPostInput | null {
  const { title, slug, excerpt, coverImage, content, tags, published } = body;
  if (typeof title !== "string" || !title.trim()) return null;
  if (typeof content !== "string") return null;

  return {
    title: title.trim(),
    slug: slugify(typeof slug === "string" && slug.trim() ? slug : title),
    excerpt: typeof excerpt === "string" ? excerpt.trim() : "",
    coverImage: typeof coverImage === "string" ? coverImage.trim() : "",
    content,
    tags: Array.isArray(tags) ? tags.filter((t): t is string => typeof t === "string") : [],
    published: published === true,
  };
}

export async function deletePost(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
