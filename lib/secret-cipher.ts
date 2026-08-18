const SECRET_CIPHER: Record<string, string> = {
  A: "ϟ•",
  B: "ʚ7",
  C: "—ϟ",
  D: "ʚK",
  E: "ʚ•",
  F: "Ϟ7",
  G: "ꙮ7",
  H: "ϟ",
  I: "•ʚ",
  J: "Ϟ—",
  K: "ꙮK",
  L: "ʚ—",
  M: "ϟK",
  N: "ꙮ•",
  O: "Ϟϟ",
  P: "ʚϟ",
  Q: "ꙮ—",
  R: "Ϟ•",
  S: "•ϟ",
  T: "—ʚ",
  U: "ʚϞ",
  V: "ϟꙮ",
  W: "•ꙮ",
  X: "Kϟ",
  Y: "—Ϟ",
  Z: "ꙮϞ",
};

/** Encodes text letter-by-letter into the secret symbol cipher; whitespace and punctuation
 * pass through unchanged so word/line breaks in the source text are preserved. No separator
 * is added between symbols — padding every character would bloat short phrases and, worse,
 * blow up the reserved on-screen size for a secret spanning a whole paragraph. */
export function encodeSecret(word: string): string {
  return word
    .split("")
    .map((char) => SECRET_CIPHER[char.toUpperCase()] ?? char)
    .join("");
}

/** Splits letter content on **word** markers into plain-text and secret-word segments. */
export type LetterSegment =
  | { type: "text"; value: string }
  | { type: "secret"; value: string };

export function parseSecretSegments(content: string): LetterSegment[] {
  const segments: LetterSegment[] = [];
  const pattern = /\*\*([\s\S]+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: "secret", value: match[1]! });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }
  return segments;
}
