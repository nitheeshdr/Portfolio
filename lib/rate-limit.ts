import { getDb } from "@/lib/mongodb";

type HitDoc = { key: string; createdAt: Date };

/** Best-effort client IP from proxy headers (Vercel and most hosts set x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Sliding-window limiter backed by MongoDB (so it works across serverless
 * instances). Records this hit and returns the seconds to wait if `key` has
 * already made `limit` hits inside `windowMs`, otherwise null. Fails open if
 * the database is unreachable so a DB blip never blocks real visitors.
 */
export async function hitRateLimit(
  scope: string,
  key: string,
  limit: number,
  windowMs: number
): Promise<number | null> {
  try {
    const db = await getDb();
    const collection = db.collection<HitDoc>(`rate_limit_${scope}`);
    await collection
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: Math.ceil(windowMs / 1000) })
      .catch(() => undefined);

    const since = new Date(Date.now() - windowMs);
    const recent = await collection
      .find({ key, createdAt: { $gte: since } })
      .sort({ createdAt: 1 })
      .toArray();

    if (recent.length >= limit) {
      const retryAt = recent[0]!.createdAt.getTime() + windowMs;
      return Math.max(1, Math.ceil((retryAt - Date.now()) / 1000));
    }

    await collection.insertOne({ key, createdAt: new Date() });
    return null;
  } catch {
    return null;
  }
}
