import { NextResponse } from "next/server";
import {
  deleteProject,
  getProjectByMongoId,
  isProjectSlugTaken,
  parseProjectInput,
  updateProject,
} from "@/lib/projects-db";

type Params = { id: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params;
  const project = await getProjectByMongoId(id);
  if (!project) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, project });
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
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const input = parseProjectInput(body as Record<string, unknown>);
  if (!input) {
    return NextResponse.json(
      { ok: false, error: "Name, category, headline, description, meta, and language are required." },
      { status: 400 }
    );
  }
  if (!input.id) {
    return NextResponse.json({ ok: false, error: "Could not generate an id from the name." }, { status: 400 });
  }
  if (await isProjectSlugTaken(input.id, id)) {
    return NextResponse.json({ ok: false, error: "That project id is already in use." }, { status: 409 });
  }

  const project = await updateProject(id, input);
  if (!project) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, project });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  const { id } = await params;
  const deleted = await deleteProject(id);
  if (!deleted) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
