import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a root-relative public path (e.g. "/thumbs/x.jpg") against the
 * app's actual base URL. Needed because GitHub Pages project sites serve
 * from a subpath ("/HPAIR/"), which Vite only rewrites for asset references
 * it processes at build time — not for plain strings used as `src` at runtime.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
