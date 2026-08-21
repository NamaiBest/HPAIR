export type Country = { id: string; name: string; status: "live" | "expanding" };
export const COUNTRIES: Country[] = [
  { id: "vn", name: "Vietnam", status: "live" },
  { id: "la", name: "Laos", status: "live" },
  { id: "kh", name: "Cambodia", status: "live" },
  { id: "th", name: "Thailand", status: "expanding" },
  { id: "mm", name: "Myanmar", status: "expanding" },
];

export const FIELDS = [
  "Finance",
  "Engineering",
  "Social Sciences",
  "Agriculture",
  "Business",
  "Arts & Humanities",
  "Computer Science",
] as const;
export type Field = (typeof FIELDS)[number];

export const LEVELS = ["Beginner", "Some experience", "Confident"] as const;
export type Level = (typeof LEVELS)[number];

export const GOALS = [
  "Move into a technical role",
  "Make my current work faster",
  "Prepare for graduate hiring",
  "Start something of my own",
] as const;
export type Goal = (typeof GOALS)[number];

export const LANGUAGES = ["Vietnamese", "Lao", "Khmer", "Thai", "Burmese", "English"] as const;
export type Language = (typeof LANGUAGES)[number];

export const INSTITUTION_SUGGESTIONS = [
  "Can Tho University",
  "University of Science, VNU-HCM",
  "Hue University of Economics",
  "National University of Laos",
  "Royal University of Phnom Penh",
  "Nong Lam University",
  "Saigon University",
  "University of Social Sciences and Humanities",
];

export type Profile = {
  country: string;
  institution: string;
  field: Field;
  level: Level;
  goal: Goal;
  language: Language;
};

export const DEFAULT_PROFILE: Profile = {
  country: "Vietnam",
  institution: "Can Tho University",
  field: "Finance",
  level: "Beginner",
  goal: "Move into a technical role",
  language: "Vietnamese",
};
