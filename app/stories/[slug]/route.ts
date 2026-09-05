import { NextResponse } from "next/server";

import {
  renderAmpStoryHtml,
  renderStoryNotFoundHtml,
} from "@/lib/amp-story-html";
import { getStoryBySlug } from "@/lib/web-stories";

export const runtime = "nodejs";

type Params = { slug: string };

/**
 * Serves each Web Story as a hand-built, valid-AMP HTML document — not a
 * React page. AMP requires its own `<html amp>` shell with no Tailwind/JS
 * hydration, and a Route Handler is the only way to return that in Next.js
 * App Router without restructuring the whole app into "multiple root
 * layouts" (see the plan this was built from for the full reasoning).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story || !story.published) {
    return new NextResponse(renderStoryNotFoundHtml(), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new NextResponse(renderAmpStoryHtml(story), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
