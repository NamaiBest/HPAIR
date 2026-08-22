/**
 * The READY Score
 * ---------------
 * Every course is rated 0-10 on four factors. A learner-controlled set of
 * weights turns those four numbers into one composite score out of 10.
 *
 * This file is the whole scoring model. It is pure and deterministic:
 * the same course and the same weights always produce the same number.
 * There is no randomness and no hidden state anywhere in this file.
 */

export type FactorKey = "relevance" | "engagement" | "density" | "currency";

export type Factors = Record<FactorKey, number>; // each 0-10
export type Weights = Record<FactorKey, number>; // each 0-100, raw slider values

export const FACTOR_KEYS: FactorKey[] = ["relevance", "engagement", "density", "currency"];

export const FACTOR_META: Record<
  FactorKey,
  { label: string; blurb: string; color: string }
> = {
  relevance: {
    label: "Relevance",
    blurb: "How closely the course matches what employers in the region are hiring for.",
    color: "#14bdd0",
  },
  engagement: {
    label: "Engagement",
    blurb: "Whether the delivery is something you can realistically sit through to the end.",
    color: "#9dc73c",
  },
  density: {
    label: "Density",
    blurb: "How much you actually learn per minute, once filler is stripped out.",
    color: "#008081",
  },
  currency: {
    label: "Currency",
    blurb: "How recently it was updated, weighed against how fast this topic goes stale.",
    color: "#e0a02f",
  },
};

/**
 * Normalise raw slider values so they sum to 1.
 * If every slider is dragged to zero we fall back to equal weighting rather
 * than dividing by zero, so the catalogue can never end up scoreless.
 */
export function normalise(weights: Weights): Factors {
  const total = FACTOR_KEYS.reduce((sum, k) => sum + Math.max(0, weights[k]), 0);
  if (total <= 0) {
    return { relevance: 0.25, engagement: 0.25, density: 0.25, currency: 0.25 };
  }
  return {
    relevance: Math.max(0, weights.relevance) / total,
    engagement: Math.max(0, weights.engagement) / total,
    density: Math.max(0, weights.density) / total,
    currency: Math.max(0, weights.currency) / total,
  };
}

/** What each factor contributed to the final score, in points out of 10. */
export function contributions(factors: Factors, weights: Weights): Factors {
  const w = normalise(weights);
  return {
    relevance: factors.relevance * w.relevance,
    engagement: factors.engagement * w.engagement,
    density: factors.density * w.density,
    currency: factors.currency * w.currency,
  };
}

/**
  * The composite READY Score, 0-10.
  * Deliberately NOT rounded here: rounding happens once, in finalScore, so that
  * a score can never be displayed as 9.6 in one place and 9.7 in another.
  */
export function readyScore(factors: Factors, weights: Weights): number {
  const c = contributions(factors, weights);
  return c.relevance + c.engagement + c.density + c.currency;
}

/**
 * A personal fit adjustment, applied on top of the base score.
 * This is what makes two learners see the same catalogue in a different order.
 * It moves a score by at most +/- FIT_LIMIT points: enough to genuinely reorder
 * the catalogue, never enough to float a weak course to the top.
 */
export type FitInput = {
  courseField: string;
  courseLevel: "Beginner" | "Intermediate" | "Advanced";
  courseLanguages: string[];
  courseGoals: string[];
  profileField: string;
  profileLevel: "Beginner" | "Some experience" | "Confident";
  profileLanguages: string[];
  profileGoal: string;
};

/** The most a learner's profile can move a course, up or down. */
export const FIT_LIMIT = 2;

const LEVEL_RANK = { Beginner: 0, "Some experience": 1, Confident: 2 } as const;
const COURSE_RANK = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;

export function fitAdjustment(i: FitInput): number {
  let adj = 0;

  // Field of study is the strongest signal, and a mismatch costs something.
  // Without a real penalty an off-field course keeps almost all of its bonus,
  // and the catalogue stops responding to who the learner actually is.
  adj += i.courseField === i.profileField ? 0.9 : -0.5;

  // Taught in any language the learner reads comfortably.
  const sharesLanguage = i.courseLanguages.some((l) => i.profileLanguages.includes(l));
  adj += sharesLanguage ? 0.35 : -0.25;

  // Level match. One step above the learner is a stretch, not a mismatch.
  const gap = COURSE_RANK[i.courseLevel] - LEVEL_RANK[i.profileLevel];
  if (gap === 0) adj += 0.3;
  else if (gap === 1) adj += 0.1;
  else if (gap < 0) adj -= 0.2;
  else adj -= 0.4;

  // Does the course explicitly serve the goal the learner picked?
  adj += i.courseGoals.includes(i.profileGoal) ? 0.5 : -0.2;

  return Math.round(Math.max(-FIT_LIMIT, Math.min(FIT_LIMIT, adj)) * 100) / 100;
}

export function finalScore(factors: Factors, weights: Weights, fit: number): number {
  const s = readyScore(factors, weights) + fit;
  return Math.round(Math.max(0, Math.min(10, s)) * 10) / 10;
}

export const PRESETS: { id: string; name: string; note: string; weights: Weights }[] = [
  {
    id: "employability",
    name: "Employability",
    note: "Ranks for what gets you hired now.",
    weights: { relevance: 40, engagement: 12, density: 18, currency: 30 },
  },
  {
    id: "deep",
    name: "Deep learning",
    note: "Ranks for courses that teach the most per hour.",
    weights: { relevance: 18, engagement: 12, density: 50, currency: 20 },
  },
  {
    id: "fast",
    name: "Fast upskilling",
    note: "Ranks for courses you will actually finish this month.",
    weights: { relevance: 18, engagement: 34, density: 33, currency: 15 },
  },
  {
    id: "balanced",
    name: "Balanced",
    note: "All four factors count equally.",
    weights: { relevance: 25, engagement: 25, density: 25, currency: 25 },
  },
];

export const DEFAULT_WEIGHTS: Weights = { relevance: 25, engagement: 25, density: 25, currency: 25 };
