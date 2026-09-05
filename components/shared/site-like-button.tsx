"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "site-liked";

/**
 * A single site-wide like counter (not per-page) — click to like, click
 * again to unlike. "Liked" state is remembered per-browser via
 * localStorage; there's no visitor auth to dedupe against server-side, so
 * this is best-effort like most simple site-like widgets.
 */
export function SiteLikeButton(): ReactNode {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  // Reading localStorage (client-only) to resolve the real "liked" state
  // before paint — matches SSR's neutral `false` on first render, then
  // flips synchronously so there's no flash of the wrong heart on reload.
  useLayoutEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiked(true);
    }
  }, []);

  useEffect(() => {
    fetch("/api/likes")
      .then((res) => res.json())
      .then((data: { count?: number }) => {
        if (typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {});
  }, []);

  const toggleLike = async (): Promise<void> => {
    if (pending) return;
    const next = !liked;

    setPending(true);
    setLiked(next);
    setCount((c) => (c ?? 0) + (next ? 1 : -1));

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: next }),
      });
      const data: { count?: number } = await res.json();
      if (typeof data.count === "number") setCount(data.count);
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Roll back the optimistic update — the request never landed.
      setLiked(!next);
      setCount((c) => (c ?? 0) + (next ? -1 : 1));
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this site" : "Like this site"}
      className="focus-ring border-foreground/8 bg-background text-foreground/70 hover:text-foreground inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium tracking-tight transition-colors"
    >
      <FontAwesomeIcon
        icon={liked ? faHeartSolid : faHeartRegular}
        className={`h-3.5 w-3.5 transition-colors ${liked ? "text-rose-500" : ""}`}
        aria-hidden="true"
      />
      {count === null ? "Like this site" : count.toLocaleString()}
    </button>
  );
}
