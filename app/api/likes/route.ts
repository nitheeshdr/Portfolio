import { NextResponse } from "next/server";

import { getClientIp, hitRateLimit } from "@/lib/rate-limit";
import { adjustLikeCount, getLikeCount } from "@/lib/site-likes";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const count = await getLikeCount();
  return NextResponse.json({ count });
}

export async function POST(request: Request): Promise<NextResponse> {
  const retryAfter = await hitRateLimit(
    "likes",
    getClientIp(request),
    20,
    10 * 60 * 1000
  );
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const liked = (body as Record<string, unknown> | null)?.liked;
  if (typeof liked !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const count = await adjustLikeCount(liked ? 1 : -1);
  return NextResponse.json({ count });
}
