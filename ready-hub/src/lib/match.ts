import { COURSES, type Course } from "@/data/courses";
import { fitAdjustment, finalScore, type Weights } from "@/lib/score";
import { derivedLevel, type Profile } from "@/data/profile";

/** A translatable reason, resolved to a string by the component that renders it. */
export type Reason = { key: string; vars: Record<string, string> };

export type Ranked = Course & { score: number; fit: number; reason: Reason };

/** Why this course surfaced for this specific learner. */
function reasonFor(c: Course, p: Profile): Reason {
  const sameField = c.field === p.field;
  const shared = c.languages.filter((l) => p.languages.includes(l));
  const inLanguage = shared.length > 0;
  const servesGoal = c.goals.includes(p.goal);
  const vars = { field: p.field, goal: p.goal, language: shared[0] ?? p.languages[0], level: c.level };

  if (sameField && servesGoal) return { key: "reason.fieldAndGoal", vars };
  if (servesGoal && inLanguage) return { key: "reason.goalAndLanguage", vars };
  if (sameField) return { key: "reason.field", vars };
  if (servesGoal) return { key: "reason.goal", vars };
  if (inLanguage) return { key: "reason.language", vars };
  if (c.level === "Beginner") return { key: "reason.beginner", vars };
  return { key: "reason.merit", vars };
}

export function rank(profile: Profile, weights: Weights): Ranked[] {
  return COURSES.map((c) => {
    const fit = fitAdjustment({
      courseField: c.field,
      courseLevel: c.level,
      courseLanguages: c.languages,
      courseGoals: c.goals,
      profileField: profile.field,
      profileLevel: derivedLevel(profile),
      profileLanguages: profile.languages,
      profileGoal: profile.goal,
    });
    return {
      ...c,
      fit,
      score: finalScore(c.factors, weights, fit),
      reason: reasonFor(c, profile),
    };
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
