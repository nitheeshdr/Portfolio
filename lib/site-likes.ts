import { getDb } from "@/lib/mongodb";

type SiteLikesDoc = {
  _id: "site";
  count: number;
};

const COLLECTION = "site_likes";
const DOC_ID = "site" as const;

async function getCollection() {
  const db = await getDb();
  return db.collection<SiteLikesDoc>(COLLECTION);
}

export async function getLikeCount(): Promise<number> {
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: DOC_ID });
  return doc?.count ?? 0;
}

/** Atomically bumps the single site-wide like counter by `delta` (1 to like, -1 to unlike) and returns the new total. */
export async function adjustLikeCount(delta: 1 | -1): Promise<number> {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: DOC_ID },
    { $inc: { count: delta } },
    { upsert: true, returnDocument: "after" }
  );
  const count = result?.count ?? 0;
  // $inc with upsert can't clamp at 0, so a stray unlike before any like
  // (e.g. a replayed request) could otherwise push the stored count negative.
  if (count < 0) {
    await collection.updateOne({ _id: DOC_ID }, { $set: { count: 0 } });
    return 0;
  }
  return count;
}
