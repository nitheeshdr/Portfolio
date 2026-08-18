import { NextResponse, type NextRequest } from "next/server";
import { revealLoveLetterSecret } from "@/lib/love-letter";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const letterIndex = Number(searchParams.get("letter"));
  const segmentIndex = Number(searchParams.get("segment"));

  if (!Number.isInteger(letterIndex) || !Number.isInteger(segmentIndex)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const word = await revealLoveLetterSecret(letterIndex, segmentIndex);
  if (word === null) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, word });
}
