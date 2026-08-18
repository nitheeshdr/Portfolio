"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { PublicLetterSegment } from "@/lib/love-letter";

const SCRAMBLE_GLYPHS = "ϟ•ʚ7—KꙮϞ".split("");
const SCRAMBLE_FRAMES = 6;
const FRAME_MS = 40;

function randomGlyph(): string {
  return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]!;
}

function scramble(target: string): string {
  return target
    .split("")
    .map((ch) => (/\s/.test(ch) ? ch : randomGlyph()))
    .join("");
}

function SecretWord({
  display,
  letterIndex,
  segmentIndex,
}: {
  display: string;
  letterIndex: number;
  segmentIndex: number;
}): ReactNode {
  const [revealed, setRevealed] = useState(false);
  const [word, setWord] = useState<string | null>(null);
  const [shown, setShown] = useState(display);
  const cacheRef = useRef<string | null>(null);
  // Devices with real hover (mouse) get onMouseEnter/Leave; touch has no hover, so a tap
  // must toggle instead. Sharing both on one element would let a mouse click's implicit
  // enter-then-click sequence immediately re-hide what the hover just revealed.
  const [supportsHover] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches
  );

  const reveal = (): void => {
    setRevealed(true);
    if (cacheRef.current || word) return;
    fetch(`/api/love-letter/reveal?letter=${letterIndex}&segment=${segmentIndex}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { ok: boolean; word?: string } | null) => {
        if (json?.ok && json.word) {
          cacheRef.current = json.word;
          setWord(json.word);
        }
      })
      .catch(() => undefined);
  };

  const hide = (): void => setRevealed(false);

  useEffect(() => {
    const target = revealed && word ? word : display;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const id = window.setTimeout(() => setShown(target), 0);
      return () => window.clearTimeout(id);
    }

    let frame = 0;
    const timer = window.setInterval(() => {
      frame += 1;
      if (frame >= SCRAMBLE_FRAMES) {
        window.clearInterval(timer);
        setShown(target);
        return;
      }
      setShown(scramble(target));
    }, FRAME_MS);

    return () => window.clearInterval(timer);
  }, [revealed, word, display]);

  return (
    <span
      onMouseEnter={supportsHover ? reveal : undefined}
      onMouseLeave={supportsHover ? hide : undefined}
      onClick={(e) => {
        e.stopPropagation();
        if (supportsHover) return;
        if (revealed) hide();
        else reveal();
      }}
      role="button"
      tabIndex={0}
      aria-label={revealed && word ? word : "Secret text, hover or tap to reveal"}
      className="secret-word cursor-help underline decoration-dotted decoration-2 underline-offset-4"
    >
      <span aria-hidden="true" className="secret-word__ghost">
        {display}
      </span>
      {word ? (
        <span aria-hidden="true" className="secret-word__ghost">
          {word}
        </span>
      ) : null}
      <span className="secret-word__visible">{shown}</span>
    </span>
  );
}

export function LetterText({
  segments,
  letterIndex,
}: {
  segments: PublicLetterSegment[];
  letterIndex: number;
}): ReactNode {
  return (
    <>
      {segments.map((segment, i) =>
        segment.type === "secret" ? (
          <SecretWord
            key={i}
            display={segment.display}
            letterIndex={letterIndex}
            segmentIndex={i}
          />
        ) : (
          <span key={i}>{segment.value}</span>
        )
      )}
    </>
  );
}
