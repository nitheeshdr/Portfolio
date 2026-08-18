"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
  faHeart as faHeartSolid,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LetterText } from "./letter-text";
import type { PublicLetterSegment } from "@/lib/love-letter";

const TRIGGER = (process.env.NEXT_PUBLIC_LOVE_TRIGGER ?? "love").toLowerCase();
const HEART_COUNT = 26;
const HEARTS_DURATION_MS = 2600;
const ENVELOPE_OPEN_TO_LETTER_MS = 900;

type Stage = "hearts" | "envelope" | "letter";

type FallingHeart = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  pink: boolean;
};

function generateHearts(): FallingHeart[] {
  return Array.from({ length: HEART_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 14 + Math.random() * 22,
    delay: Math.random() * 2.5,
    duration: 3.5 + Math.random() * 2.5,
    pink: Math.random() > 0.5,
  }));
}

export function LoveSurprise({ letters }: { letters: PublicLetterSegment[][] }): ReactNode {
  const [stage, setStage] = useState<Stage | null>(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterIndex, setLetterIndex] = useState(0);
  const hearts = useMemo(() => (stage ? generateHearts() : []), [stage]);

  useEffect(() => {
    let buffer = "";
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (stage) {
        if (e.key === "Escape") {
          setStage(null);
          setEnvelopeOpen(false);
          setLetterIndex(0);
        }
        return;
      }
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer === TRIGGER) setStage("hearts");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage]);

  useEffect(() => {
    if (!stage) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "hearts") return;
    const timer = window.setTimeout(() => setStage("envelope"), HEARTS_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const openEnvelope = (): void => {
    setEnvelopeOpen(true);
    window.setTimeout(() => setStage("letter"), ENVELOPE_OPEN_TO_LETTER_MS);
  };

  const close = (): void => {
    setStage(null);
    setEnvelopeOpen(false);
    setLetterIndex(0);
  };

  const hasMultiple = letters.length > 1;

  return (
    <AnimatePresence>
      {stage ? (
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => {
            if (stage === "hearts") setStage("envelope");
            else if (stage === "letter") close();
          }}
          className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center overflow-hidden bg-black/75 backdrop-blur-sm"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ y: "-10vh", opacity: 0 }}
                animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: h.duration,
                  delay: h.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute top-0"
                style={{ left: `${h.left}%` }}
              >
                <FontAwesomeIcon
                  icon={faHeartSolid}
                  style={{
                    width: h.size,
                    height: h.size,
                    color: h.pink ? "#f472b6" : "#ef4444",
                  }}
                />
              </motion.span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {stage === "hearts" ? (
              <motion.div
                key="hearts-stage"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="relative flex flex-col items-center gap-6 px-6 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon
                    icon={faHeartOutline}
                    className="h-24 w-24 text-white drop-shadow-[0_0_20px_rgba(244,63,94,0.6)] sm:h-32 sm:w-32"
                  />
                </motion.div>
                <p className="font-serif flex flex-wrap items-center justify-center gap-3 text-[1.75rem] font-medium tracking-tight text-white sm:text-[2.5rem]">
                  I love you Prakalyaaaa
                  <FontAwesomeIcon
                    icon={faHeartSolid}
                    className="h-6 w-6 text-red-500 sm:h-8 sm:w-8"
                  />
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-[13px] tracking-tight text-white/50"
                >
                  Tap to open your letter
                </motion.p>
              </motion.div>
            ) : stage === "envelope" ? (
              <motion.div
                key="envelope-stage"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                className="relative flex cursor-auto flex-col items-center gap-6 px-6"
              >
                <p className="font-handwriting text-center text-[2rem] leading-tight font-semibold text-white sm:text-[2.75rem]">
                  I love you Prakalyaaaa
                </p>

                <div className={`love-envelope ${envelopeOpen ? "is-open" : ""}`}>
                  <div className="love-envelope-fold love-envelope-fold--left" aria-hidden="true" />
                  <div className="love-envelope-fold love-envelope-fold--right" aria-hidden="true" />
                  <div className="love-envelope-fold love-envelope-fold--bottom" aria-hidden="true" />
                  <div className="love-envelope-body" aria-hidden="true" />

                  <motion.div
                    className="love-letter-paper absolute inset-x-4 bottom-3 rounded-lg shadow-xl"
                    style={{ top: "20%" }}
                    initial={{ y: 6 }}
                    animate={envelopeOpen ? { y: -54 } : { y: 6 }}
                    transition={{ duration: 0.7, delay: envelopeOpen ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <div className="love-envelope-flap" aria-hidden="true" />

                  {!envelopeOpen ? (
                    <button
                      type="button"
                      onClick={openEnvelope}
                      aria-label="Open the envelope"
                      className="love-heart-btn"
                    >
                      <span className="love-heart-btn__label">Open</span>
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="letter-stage"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.7, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="relative mx-4 flex max-h-[85vh] w-full max-w-lg cursor-auto flex-col items-center gap-3"
              >
                <div className="love-letter-paper relative flex max-h-[75vh] w-full flex-col overflow-hidden rounded-2xl shadow-2xl">
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close letter"
                    className="focus-ring absolute top-3 right-3 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/10 text-black/50 transition-colors hover:bg-black/15 hover:text-black/70"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-4 w-4" aria-hidden="true" />
                  </button>

                  {hasMultiple ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setLetterIndex((i) => (i === 0 ? letters.length - 1 : i - 1))}
                        aria-label="Previous letter"
                        className="focus-ring absolute top-1/2 left-2 z-10 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/10 text-black/50 transition-colors hover:bg-black/15 hover:text-black/70"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setLetterIndex((i) => (i === letters.length - 1 ? 0 : i + 1))}
                        aria-label="Next letter"
                        className="focus-ring absolute top-1/2 right-2 z-10 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/10 text-black/50 transition-colors hover:bg-black/15 hover:text-black/70"
                      >
                        <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </>
                  ) : null}

                  <div data-lenis-prevent className="min-h-0 overflow-y-auto px-8 py-10 sm:px-14 sm:py-12">
                    <div className="mb-4 flex items-center gap-2 text-red-500">
                      <FontAwesomeIcon icon={faHeartSolid} className="h-5 w-5" aria-hidden="true" />
                      <FontAwesomeIcon icon={faHeartSolid} className="h-5 w-5" aria-hidden="true" />
                      <FontAwesomeIcon icon={faHeartSolid} className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={letterIndex}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.25 }}
                        className="font-handwriting text-[1.65rem] leading-[1.35] font-medium whitespace-pre-wrap text-neutral-800 sm:text-[1.85rem]"
                      >
                        <LetterText segments={letters[letterIndex]!} letterIndex={letterIndex} />
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                {hasMultiple ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      {letters.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLetterIndex(i)}
                          aria-label={`Go to letter ${i + 1}`}
                          aria-current={i === letterIndex ? "true" : undefined}
                          className={`h-2 cursor-pointer rounded-full transition-all ${
                            i === letterIndex ? "w-6 bg-white" : "w-2 bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[12px] tracking-tight text-white/50">
                      {letterIndex + 1} / {letters.length}
                    </span>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
