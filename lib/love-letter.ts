import { getDb } from "@/lib/mongodb";

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
  updatedAt: string;
};

type LoveLetterDoc = {
  _id: string;
  letters: string[];
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
    return { letters: DEFAULT_LETTERS, updatedAt: new Date(0).toISOString() };
  }
  return { letters: doc.letters, updatedAt: doc.updatedAt.toISOString() };
}

export async function updateLoveLetters(letters: string[]): Promise<LoveLetters> {
  const collection = await getCollection();
  const updatedAt = new Date();
  await collection.updateOne(
    { _id: DOC_ID },
    { $set: { letters, updatedAt } },
    { upsert: true }
  );
  return { letters, updatedAt: updatedAt.toISOString() };
}
