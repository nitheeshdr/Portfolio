import { getDb } from "@/lib/mongodb";
import {
  encodeSecret,
  parseSecretSegments,
  type LetterSegment,
} from "@/lib/secret-cipher";

const COLLECTION = "love_letter";
const DOC_ID = "singleton";

const DEFAULT_LETTERS = [
  `My dearest Prakalya,

From the moment you came into my life, everything got a little brighter.
Every day with you feels like the best part of my story.

Thank you for being you — for your smile, your patience, and your love.

I love you, today and always.

Yours,
Nitheesh`,
];

export type LoveLetters = {
  letters: string[];
  envelopeEnabled: boolean;
  updatedAt: string;
};

type LoveLetterDoc = {
  _id: string;
  letters: string[];
  envelopeEnabled?: boolean;
  updatedAt: Date;
};

async function getCollection() {
  const db = await getDb();
  return db.collection<LoveLetterDoc>(COLLECTION);
}

export async function getLoveLetters(): Promise<LoveLetters> {
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: DOC_ID });
  if (!doc || !doc.letters.length) {
    return {
      letters: DEFAULT_LETTERS,
      envelopeEnabled: true,
      updatedAt: new Date(0).toISOString(),
    };
  }
  return {
    letters: doc.letters,
    envelopeEnabled: doc.envelopeEnabled ?? true,
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function updateLoveLetters(
  letters: string[],
  envelopeEnabled: boolean
): Promise<LoveLetters> {
  const collection = await getCollection();
  const updatedAt = new Date();
  await collection.updateOne(
    { _id: DOC_ID },
    { $set: { letters, envelopeEnabled, updatedAt } },
    { upsert: true }
  );
  return { letters, envelopeEnabled, updatedAt: updatedAt.toISOString() };
}

/** Public segment shape sent to the client: secret words are replaced with their
 * cipher-encoded display text, never the plaintext. The real word is only
 * fetched on demand via /api/love-letter/reveal when hovered or tapped. */
export type PublicLetterSegment =
  | { type: "text"; value: string }
  | { type: "secret"; display: string };

export type PublicLoveLetters = {
  letters: PublicLetterSegment[][];
  envelopeEnabled: boolean;
};

export async function getPublicLoveLetters(): Promise<PublicLoveLetters> {
  const { letters, envelopeEnabled } = await getLoveLetters();
  return {
    envelopeEnabled,
    letters: letters.map((letter) =>
      parseSecretSegments(letter).map(
        (segment): PublicLetterSegment =>
          segment.type === "secret"
            ? { type: "secret", display: encodeSecret(segment.value) }
            : { type: "text", value: segment.value }
      )
    ),
  };
}

/** Looks up the plaintext for one secret segment, server-side only. */
export async function revealLoveLetterSecret(
  letterIndex: number,
  segmentIndex: number
): Promise<string | null> {
  const { letters } = await getLoveLetters();
  const letter = letters[letterIndex];
  if (letter === undefined) return null;
  const segments: LetterSegment[] = parseSecretSegments(letter);
  const segment = segments[segmentIndex];
  if (!segment || segment.type !== "secret") return null;
  return segment.value;
}
