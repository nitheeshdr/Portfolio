"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ContactModalProvider } from "@/components/contact/contact-modal-context";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReducedMotionProvider>
        <ContactModalProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ContactModalProvider>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
