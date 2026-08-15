"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEnvelope,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { person } from "@/lib/person";

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "sending" | "sent" | "error";

export function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactNode {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 100);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      const resetTimer = window.setTimeout(() => setStatus("idle"), 300);
      return () => window.clearTimeout(resetTimer);
    }
    return undefined;
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Contact form"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="border-foreground/10 bg-background relative w-full max-w-md rounded-4xl border p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="focus-ring border-foreground/8 text-foreground/60 hover:text-foreground bg-background absolute top-4 right-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" aria-hidden="true" />
            </button>

            {status === "sent" ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <span className="bg-foreground text-background flex h-12 w-12 items-center justify-center rounded-full">
                  <FontAwesomeIcon icon={faCheck} className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="font-serif text-[1.5rem] font-medium tracking-tight text-foreground">
                  Message sent
                </h2>
                <p className="text-foreground/60 max-w-[30ch] text-[14px] tracking-tight">
                  Thanks for reaching out — I&rsquo;ll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="focus-ring bg-foreground text-background mt-2 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-[1.5rem] font-medium tracking-tight text-foreground sm:text-[1.75rem]">
                  Get in touch
                </h2>
                <p className="text-foreground/60 mt-1 mb-6 text-[14px] tracking-tight">
                  I&rsquo;ll reply from {person.email}.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                  />

                  <label className="flex flex-col gap-1.5">
                    <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
                      Name
                    </span>
                    <input
                      ref={firstFieldRef}
                      type="text"
                      name="name"
                      required
                      maxLength={100}
                      placeholder="Your name"
                      className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      maxLength={200}
                      placeholder="you@example.com"
                      className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
                      Message
                    </span>
                    <textarea
                      name="message"
                      required
                      maxLength={4000}
                      rows={4}
                      placeholder="What's on your mind?"
                      className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring resize-none rounded-xl border px-3.5 py-2.5 text-[15px] tracking-tight text-foreground outline-none"
                    />
                  </label>

                  {status === "error" ? (
                    <p className="text-[13px] tracking-tight text-red-500">{errorMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="focus-ring bg-foreground text-background mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" aria-hidden="true" />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
