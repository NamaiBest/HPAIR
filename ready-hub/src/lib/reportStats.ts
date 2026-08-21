/**
 * Aggregate numbers for the impact report on the home page.
 * Derived once from the seed catalogue — no fetching, no randomness.
 */
import { COURSES } from "@/data/courses";
import { PLATFORM_BY_ID } from "@/data/platforms";
import { DEFAULT_WEIGHTS, FACTOR_KEYS, FACTOR_META, finalScore } from "@/lib/score";

export const totalCourses = COURSES.length;
export const totalLectures = COURSES.reduce((s, c) => s + c.lectures.length, 0);
export const totalMinutes = COURSES.reduce((s, c) => s + c.minutes, 0);
export const platformsUsed = new Set(COURSES.map((c) => c.platformId)).size;

export const avgScore =
  Math.round(
    (COURSES.reduce((s, c) => s + finalScore(c.factors, DEFAULT_WEIGHTS, 0), 0) / COURSES.length) * 10,
  ) / 10;

export const coursesByPlatform = Object.entries(
  COURSES.reduce<Record<string, number>>((acc, c) => {
    acc[c.platformId] = (acc[c.platformId] ?? 0) + 1;
    return acc;
  }, {}),
)
  .map(([id, count]) => ({ id, name: PLATFORM_BY_ID[id].name, hex: PLATFORM_BY_ID[id].hex, count }))
  .sort((a, b) => b.count - a.count);

export const avgFactors = FACTOR_KEYS.map((key) => ({
  key,
  label: FACTOR_META[key].label,
  color: FACTOR_META[key].color,
  value: Math.round((COURSES.reduce((s, c) => s + c.factors[key], 0) / COURSES.length) * 10) / 10,
}));
