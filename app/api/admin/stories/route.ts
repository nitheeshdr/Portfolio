import { NextResponse } from "next/server";
import {
  createStory,
  getAllStories,
  isSlugTaken,
  parseWebStoryInput,
} from "@/lib/web-stories";

export async function GET(): Promise<NextResponse> {
  const stories = await getAllStories();
  return NextResponse.json({ ok: true, stories });
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const input = parseWebStoryInput(body as Record<string, unknown>);
  if (!input) {
    return NextResponse.json(
      {
        ok: false,
        error: "Title, poster image, and at least one page are required.",
      },
      { status: 400 }
    );
  }
  if (!input.slug) {
    return NextResponse.json(
      { ok: false, error: "Could not generate a slug from the title." },
      { status: 400 }
    );
  }
  if (await isSlugTaken(input.slug)) {
    return NextResponse.json(
      { ok: false, error: "That slug is already in use." },
      { status: 409 }
    );
  }

  const story = await createStory(input);
  return NextResponse.json({ ok: true, story }, { status: 201 });
}
