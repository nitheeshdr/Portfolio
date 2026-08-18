"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useState, type FormEvent, type ReactNode } from "react";

export function LoveLetterEditor({
  initialLetters,
}: {
  initialLetters: string[];
}): ReactNode {
  const [letters, setLetters] = useState<string[]>(
    initialLetters.length ? initialLetters : [""]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const updateLetter = (index: number, value: string): void => {
    setLetters((prev) => prev.map((l, i) => (i === index ? value : l)));
  };

  const addLetter = (): void => {
    setLetters((prev) => [...prev, ""]);
  };

  const removeLetter = (index: number): void => {
    setLetters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/admin/love-letter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letters }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong.");
        return;
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {letters.map((letter, index) => (
          <div
            key={index}
            className="border-foreground/10 flex flex-col gap-2 rounded-2xl border p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-foreground/70 text-[13px] font-medium tracking-tight">
                Letter {index + 1}
              </span>
              {letters.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeLetter(index)}
                  aria-label={`Remove letter ${index + 1}`}
                  className="focus-ring border-foreground/10 text-foreground/50 hover:text-red-500 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <textarea
              value={letter}
              onChange={(e) => updateLetter(index, e.target.value)}
              required
              rows={10}
              maxLength={4000}
              className="border-foreground/10 bg-foreground/2 dark:bg-foreground/5 focus-ring rounded-xl border px-3.5 py-2.5 text-[15px] leading-relaxed tracking-tight text-foreground outline-none"
            />
            <span className="text-foreground/40 text-[12px] tracking-tight">
              {letter.length} / 4000
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={addLetter}
          className="focus-ring border-foreground/15 hover:bg-foreground/2 dark:hover:bg-foreground/5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3.5 py-3 text-[13px] font-medium tracking-tight text-foreground/70 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" aria-hidden="true" />
          Add another letter
        </button>
      </div>

      <p className="text-foreground/40 text-[12px] tracking-tight">
        Shown one at a time, in this order, in a handwriting font when she opens the envelope.
      </p>

      {error ? <p className="text-[13px] tracking-tight text-red-500">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="focus-ring bg-foreground text-background inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save letters"}
        </button>
        {saved ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] tracking-tight text-foreground/60">
            <FontAwesomeIcon icon={faHeart} className="h-3.5 w-3.5 text-red-500" aria-hidden="true" />
            Saved
          </span>
        ) : null}
      </div>
    </form>
  );
}
