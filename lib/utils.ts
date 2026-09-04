import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard shadcn-style class merge: clsx for conditional joining, then
 * tailwind-merge to resolve conflicting utilities (e.g. two different
 * `fill-*` classes) by keeping the last one — a plain string join can't do
 * that, so components built assuming this behavior (like the vritti
 * ContributionGraph) silently lose their overrides without it.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
