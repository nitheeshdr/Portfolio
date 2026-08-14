import { NextResponse } from "next/server";
import { createPost, getAllPosts, isSlugTaken, parseBlogPostInput } from "@/lib/blog";

export async function GET(): Promise<NextResponse> {
  const posts = await getAllPosts();
  return NextResponse.json({ ok: true, posts });
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const input = parseBlogPostInput(body as Record<string, unknown>);
  if (!input) {
    return NextResponse.json({ ok: false, error: "Title and content are required." }, { status: 400 });
  }
  if (!input.slug) {
    return NextResponse.json({ ok: false, error: "Could not generate a slug from the title." }, { status: 400 });
  }
  if (await isSlugTaken(input.slug)) {
    return NextResponse.json({ ok: false, error: "That slug is already in use." }, { status: 409 });
  }

  const post = await createPost(input);
  return NextResponse.json({ ok: true, post }, { status: 201 });
}
