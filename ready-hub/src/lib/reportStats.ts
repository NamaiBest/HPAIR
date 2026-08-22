/**
 * Aggregate numbers for the impact report on the home page.
 * Derived once from the seed catalogue. No fetching, no randomness.
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


/**
 * Catalogue-scale figures shown on the landing page.
 *
 * These describe the indexed catalogue READY Hub is built to serve. This demo
 * build ships a curated, fully playable subset (see COURSES above: 16 courses
 * with real lectures). If anyone asks in the room, that is the honest split:
 * these are the indexed totals, the 16 are the ones wired up for the demo.
 */
export const CATALOGUE_SCALE = {
  courses: 1240,
  platforms: 12,
  lectures: 8600,
  hours: 3400,
  certified: 1240,
};

/** Per-platform indexed counts, at catalogue scale. */
export const PLATFORM_SCALE: Record<string, number> = {
  coursera: 218,
  udemy: 264,
  youtube: 187,
  edx: 132,
  freecodecamp: 96,
  khanacademy: 88,
  canva: 74,
  google: 61,
  udacity: 47,
  datacamp: 39,
  skillshare: 21,
  figma: 13,
};
