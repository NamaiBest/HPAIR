import { COURSES, type Course } from "@/data/courses";
import { fitAdjustment, finalScore, type Weights } from "@/lib/score";
import type { Profile } from "@/data/profile";

export type Ranked = Course & { score: number; fit: number; reason: string };

/** One line explaining why this course surfaced for this specific learner. */
function reasonFor(c: Course, p: Profile): string {
  const sameField = c.field === p.field;
  const inLanguage = c.languages.includes(p.language);
  const servesGoal = c.goals.includes(p.goal);

  if (sameField && servesGoal)
    return `Sits inside ${p.field} and points straight at "${p.goal.toLowerCase()}".`;
  if (servesGoal && inLanguage)
    return `Serves your goal and is available in ${p.language}.`;
  if (sameField)
    return `Core ${p.field} material at ${c.level.toLowerCase()} level.`;
  if (servesGoal)
    return `Bridges from ${p.field} toward "${p.goal.toLowerCase()}" without assuming a technical background.`;
  if (inLanguage)
    return `Widely useful outside ${p.field}, and available in ${p.language}.`;
  if (c.level === "Beginner")
    return `A starting point outside ${p.field} that assumes nothing.`;
  return `Strong on its own merits, though outside ${p.field}.`;
}

export function rank(profile: Profile, weights: Weights): Ranked[] {
  return COURSES.map((c) => {
    const fit = fitAdjustment({
      courseField: c.field,
      courseLevel: c.level,
      courseLanguages: c.languages,
      courseGoals: c.goals,
      profileField: profile.field,
      profileLevel: profile.level,
      profileLanguage: profile.language,
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
