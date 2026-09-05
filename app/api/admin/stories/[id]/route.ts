import { NextResponse } from "next/server";
import {
  deleteStory,
  getStoryById,
  isSlugTaken,
  parseWebStoryInput,
  updateStory,
} from "@/lib/web-stories";

type Params = { id: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) {
    return NextResponse.json(
      { ok: false, error: "Not found." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true, story });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params;

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
  if (await isSlugTaken(input.slug, id)) {
    return NextResponse.json(
      { ok: false, error: "That slug is already in use." },
      { status: 409 }
    );
  }

  const story = await updateStory(id, input);
  if (!story) {
    return NextResponse.json(
      { ok: false, error: "Not found." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true, story });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params;
  const deleted = await deleteStory(id);
  if (!deleted) {
    return NextResponse.json(
      { ok: false, error: "Not found." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
