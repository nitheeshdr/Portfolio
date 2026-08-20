import { NextResponse } from "next/server";
import { getLoveLetters, updateLoveLetters } from "@/lib/love-letter";

export async function GET(): Promise<NextResponse> {
  const letters = await getLoveLetters();
  return NextResponse.json({ ok: true, letters });
}

export async function PUT(request: Request): Promise<NextResponse> {
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

  const { letters, envelopeEnabled } = body as Record<string, unknown>;
  if (!Array.isArray(letters) || letters.length === 0) {
    return NextResponse.json(
      { ok: false, error: "At least one letter is required." },
      { status: 400 }
    );
  }
  const cleaned = letters
    .filter((l): l is string => typeof l === "string" && l.trim().length > 0)
    .map((l) => l.trim());
  if (cleaned.length === 0) {
    return NextResponse.json(
      { ok: false, error: "At least one letter is required." },
      { status: 400 }
    );
  }
  if (cleaned.some((l) => l.length > 4000)) {
    return NextResponse.json(
      {
        ok: false,
        error: "One of the letters is too long (max 4000 characters).",
      },
      { status: 400 }
    );
  }

  const result = await updateLoveLetters(cleaned, envelopeEnabled !== false);
  return NextResponse.json({ ok: true, letters: result });
}
