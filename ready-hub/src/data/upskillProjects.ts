/**
 * Dummy seed content for the Self-Upskill project portal: the "work and
 * learn" loop. Each brief is a small, real task, not a toy exercise, and
 * completing one hands back the next.
 */
export type UpskillProject = {
  id: string;
  title: string;
  brief: string;
  deliverables: string[];
  field: string;
  minutes: number;
};

export const UPSKILL_PROJECTS: UpskillProject[] = [
  {
    id: "u1",
    title: "One-page fundraising flyer for a local NGO",
    brief:
      "A small literacy NGO needs a single-page flyer for a fundraising drive. Assume they have no design budget and the flyer will mostly be shared as a phone screenshot, not printed.",
    deliverables: ["One PNG, portrait orientation", "Readable at phone-screen size", "One clear call to action"],
    field: "Design & Media",
    minutes: 45,
  },
  {
    id: "u2",
    title: "Personal budget tracker in a spreadsheet",
    brief:
      "Build a spreadsheet that takes a month of transactions and produces a spend-by-category summary automatically. It should survive someone else pasting in their own data.",
    deliverables: ["Formulas, not manual totals", "A chart that updates when data changes", "One sheet of instructions"],
    field: "Finance",
    minutes: 60,
  },
  {
    id: "u3",
    title: "300-word explainer of a technical topic for a non-expert",
    brief:
      "Pick a concept from any course you've started and explain it to someone with no background in it, in under 300 words, with no jargon left unexplained.",
    deliverables: ["Under 300 words", "Zero unexplained jargon", "One analogy that actually helps"],
    field: "Communications",
    minutes: 30,
  },
  {
    id: "u4",
    title: "Clean up a messy public dataset",
    brief:
      "Take any small public dataset with obvious problems (missing values, inconsistent formatting) and produce a cleaned version plus a short note on what you changed and why.",
    deliverables: ["Cleaned file", "A change log", "One chart from the cleaned data"],
    field: "Computer Science",
    minutes: 60,
  },
  {
    id: "u5",
    title: "Three-slide pitch for a project idea of your own",
    brief:
      "Problem, who has it, and why your approach is worth someone's time. Three slides, no more. This is the exercise every founder pitch in Collaborate started as.",
    deliverables: ["Exactly 3 slides", "One sentence per slide's headline", "No slide read aloud, only shown"],
    field: "Business",
    minutes: 40,
  },
];
