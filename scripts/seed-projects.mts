/**
 * One-time migration: copies the static PROJECTS array into MongoDB so the
 * admin panel and public pages can read/write projects from the database.
 * Run once locally:
 *   node --env-file=.env.local scripts/seed-projects.mts
 * Safe to re-run — skips any project `id` that already exists in the collection.
 */
import { MongoClient } from "mongodb";
import { PROJECTS } from "../components/projects/projects-data.ts";

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB ?? "portfolio");
  const collection = db.collection("projects");

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < PROJECTS.length; i++) {
    const project = PROJECTS[i]!;
    const existing = await collection.findOne({ id: project.id });
    if (existing) {
      skipped++;
      continue;
    }
    const now = new Date();
    await collection.insertOne({ ...project, order: i, createdAt: now, updatedAt: now });
    inserted++;
  }

  console.log(`Seeded projects: ${inserted} inserted, ${skipped} already existed.`);
  await client.close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
