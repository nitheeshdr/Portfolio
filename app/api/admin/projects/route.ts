import { NextResponse } from "next/server";
import {
  createProject,
  getAllProjects,
  isProjectSlugTaken,
  parseProjectInput,
} from "@/lib/projects-db";

export async function GET(): Promise<NextResponse> {
  const projects = await getAllProjects();
  return NextResponse.json({ ok: true, projects });
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
  if (await isProjectSlugTaken(input.id)) {
    return NextResponse.json({ ok: false, error: "That project id is already in use." }, { status: 409 });
  }

  const project = await createProject(input);
  return NextResponse.json({ ok: true, project }, { status: 201 });
}
