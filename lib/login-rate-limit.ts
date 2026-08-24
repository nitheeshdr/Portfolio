import { getDb } from "@/lib/mongodb";

const COLLECTION = "admin_login_attempts";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type AttemptDoc = {
  ip: string;
  createdAt: Date;
};

async function getCollection() {
  const db = await getDb();
  const collection = db.collection<AttemptDoc>(COLLECTION);
  // TTL index: attempt documents expire on their own, no manual cleanup needed.
  await collection
    .createIndex({ createdAt: 1 }, { expireAfterSeconds: WINDOW_MS / 1000 })
    .catch(() => undefined);
  return collection;
}

/** Returns the number of seconds to wait before retrying, or null if the IP isn't rate-limited. */
export async function checkLoginRateLimit(ip: string): Promise<number | null> {
  const collection = await getCollection();
  const since = new Date(Date.now() - WINDOW_MS);
  const attempts = await collection
    .find({ ip, createdAt: { $gte: since } })
    .sort({ createdAt: 1 })
    .toArray();

  if (attempts.length < MAX_ATTEMPTS) return null;

  const oldest = attempts[0]!.createdAt;
  const retryAt = oldest.getTime() + WINDOW_MS;
  return Math.max(1, Math.ceil((retryAt - Date.now()) / 1000));
}

export async function recordFailedLogin(ip: string): Promise<void> {
  const collection = await getCollection();
  await collection.insertOne({ ip, createdAt: new Date() });
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  const collection = await getCollection();
  await collection.deleteMany({ ip });
}
