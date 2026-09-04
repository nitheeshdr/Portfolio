"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useState, type ReactNode } from "react";

import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";

const SESSION_KEY = "home-preloader-shown";
const HOLD_MS = 350;
const EASE = [0.76, 0, 0.24, 1] as const;

type Phase = "pending" | "loading" | "done";

/**
 * A one-time "Hello" intro before the home page content, shown only once
 * per browser session (sessionStorage) so returning visitors — and every
 * internal navigation back to "/" — skip straight to "done". Starts as
 * "pending" (server-safe, no window access) and flips synchronously via
 * useLayoutEffect before paint, so repeat visits never flash the intro.
 */
export function HomePreloader({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [phase, setPhase] = useState<Phase>("pending");

  useLayoutEffect(() => {
    // Reading sessionStorage (a client-only API) to resolve the real phase
    // before paint is exactly what useLayoutEffect is for — deferring this
    // setState (e.g. via setTimeout) would let the browser paint the wrong
    // phase first, bringing back the flash this hook exists to prevent.
    if (sessionStorage.getItem(SESSION_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
    } else {
      setPhase("loading");
    }
  }, []);

  const finish = (): void => {
    window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
    }, HOLD_MS);
  };

  const showIntro = phase === "loading";

  return (
    <>
      {/*
       * The page underneath always renders in its normal, final state —
       * no coordinated enter animation on it. The "zoom into the page"
       * feel comes entirely from this overlay's own exit transition
       * (scale up + fade), which reveals the static content underneath
       * as it flies past the camera. Keeping the underlying content
       * un-animated sidesteps a real Framer Motion footgun: `initial`
       * is only honored on a component's first mount, so trying to
       * conditionally animate `children` in based on `phase` (which
       * only settles after that first render) would silently never
       * fire.
       */}
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            key="home-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 8 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="bg-background text-foreground fixed inset-0 z-[300] flex items-center justify-center"
          >
            <AppleHelloEnglishEffect
              className="h-14 sm:h-20"
              onAnimationComplete={finish}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {children}
    </>
  );
}
