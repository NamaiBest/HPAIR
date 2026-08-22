export type Country = { id: string; name: string; nameVi: string; status: "live" | "expanding" };

export const COUNTRIES: Country[] = [
  { id: "vn", name: "Vietnam", nameVi: "Việt Nam", status: "live" },
  { id: "la", name: "Laos", nameVi: "Lào", status: "live" },
  { id: "kh", name: "Cambodia", nameVi: "Campuchia", status: "live" },
  { id: "th", name: "Thailand", nameVi: "Thái Lan", status: "live" },
  { id: "mm", name: "Myanmar", nameVi: "Myanmar", status: "live" },
];

/** Real universities, grouped by country. Used to populate the picker. */
export const UNIVERSITIES: Record<string, string[]> = {
  Vietnam: [
    "VinUniversity",
    "Vietnam National University, Hanoi",
    "Vietnam National University, Ho Chi Minh City",
    "University of Science, VNU-HCM",
    "University of Social Sciences and Humanities, VNU-HCM",
    "Hanoi University of Science and Technology",
    "National Economics University",
    "Foreign Trade University",
    "University of Economics Ho Chi Minh City",
    "Can Tho University",
    "Hue University",
    "Hue University of Economics",
    "University of Danang",
    "Ton Duc Thang University",
    "Nong Lam University",
    "Saigon University",
    "Banking University of Ho Chi Minh City",
    "Hanoi University",
    "Thuyloi University",
    "Vietnam Maritime University",
    "Thai Nguyen University",
    "Vinh University",
    "Quy Nhon University",
    "Da Lat University",
    "Tra Vinh University",
    "An Giang University",
    "Dong Thap University",
    "Industrial University of Ho Chi Minh City",
    "Posts and Telecommunications Institute of Technology",
    "FPT University",
    "RMIT University Vietnam",
  ],
  Laos: [
    "National University of Laos",
    "Souphanouvong University",
    "Champasack University",
    "Savannakhet University",
    "University of Health Sciences, Laos",
    "Lao-American College",
  ],
  Cambodia: [
    "Royal University of Phnom Penh",
    "Institute of Technology of Cambodia",
    "Royal University of Law and Economics",
    "National University of Management",
    "University of Health Sciences, Cambodia",
    "Royal University of Agriculture",
    "Paññāsāstra University of Cambodia",
    "Cambodian Mekong University",
  ],
  Thailand: [
    "Chulalongkorn University",
    "Mahidol University",
    "Thammasat University",
    "Kasetsart University",
    "Chiang Mai University",
    "Khon Kaen University",
    "Prince of Songkla University",
  ],
  Myanmar: [
    "University of Yangon",
    "Yangon University of Economics",
    "Mandalay University",
    "Yangon Technological University",
  ],
};

export const FIELDS = [
  "Arts & Humanities",
  "Design & Media",
  "Communications",
  "Performing Arts",
  "Social Sciences",
  "Education",
  "Business",
  "Finance",
  "Economics",
  "Engineering",
  "Computer Science",
  "Agriculture",
  "Health Sciences",
  "Law & Policy",
] as const;
export type Field = (typeof FIELDS)[number];

export const FIELD_VI: Record<Field, string> = {
  "Arts & Humanities": "Nghệ thuật & Nhân văn",
  "Design & Media": "Thiết kế & Truyền thông",
  Communications: "Truyền thông",
  "Performing Arts": "Nghệ thuật biểu diễn",
  "Social Sciences": "Khoa học xã hội",
  Education: "Giáo dục",
  Business: "Kinh doanh",
  Finance: "Tài chính",
  Economics: "Kinh tế",
  Engineering: "Kỹ thuật",
  "Computer Science": "Khoa học máy tính",
  Agriculture: "Nông nghiệp",
  "Health Sciences": "Khoa học sức khoẻ",
  "Law & Policy": "Luật & Chính sách",
};

/** Where the learner is in their education, rather than a self-rated skill guess. */
export const STUDY_LEVELS = ["Undergraduate", "Master's", "Doctoral"] as const;
export type StudyLevel = (typeof STUDY_LEVELS)[number];

export const STUDY_LEVEL_VI: Record<StudyLevel, string> = {
  Undergraduate: "Đại học",
  "Master's": "Thạc sĩ",
  Doctoral: "Tiến sĩ",
};

export const YEARS = [1, 2, 3, 4, 5] as const;
export type Year = (typeof YEARS)[number];

export const GOALS = [
  "Move into a technical role",
  "Make my current work faster",
  "Prepare for graduate hiring",
  "Start something of my own",
] as const;
export type Goal = (typeof GOALS)[number];

export const GOAL_VI: Record<Goal, string> = {
  "Move into a technical role": "Chuyển sang vị trí kỹ thuật",
  "Make my current work faster": "Làm việc hiện tại nhanh hơn",
  "Prepare for graduate hiring": "Chuẩn bị xin việc sau tốt nghiệp",
  "Start something of my own": "Khởi nghiệp của riêng tôi",
};

export const LANGUAGES = ["Vietnamese", "Lao", "Khmer", "Thai", "Burmese", "English"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_VI: Record<Language, string> = {
  Vietnamese: "Tiếng Việt",
  Lao: "Tiếng Lào",
  Khmer: "Tiếng Khmer",
  Thai: "Tiếng Thái",
  Burmese: "Tiếng Miến",
  English: "Tiếng Anh",
};

export type Profile = {
  country: string;
  institution: string;
  /** Broad field of study, used to rank the catalogue. */
  field: Field;
  /** The learner's own major, in their words. Free text, never a dropdown:
   *  a humanities student can major in something technical and vice versa. */
  major: string;
  studyLevel: StudyLevel;
  year: Year;
  goal: Goal;
  /** Languages the learner reads comfortably. At least one. */
  languages: Language[];
};

export const DEFAULT_PROFILE: Profile = {
  country: "Vietnam",
  institution: "VinUniversity",
  field: "Finance",
  major: "",
  studyLevel: "Undergraduate",
  year: 2,
  goal: "Move into a technical role",
  languages: ["Vietnamese", "English"],
};

/**
 * Experience level, derived from where someone actually is in their degree
 * rather than asked directly. A first-year undergraduate and a doctoral
 * candidate need different starting points, and this is a more reliable
 * signal than a self-rated confidence score.
 */
export type DerivedLevel = "Beginner" | "Some experience" | "Confident";

export function derivedLevel(p: Pick<Profile, "studyLevel" | "year">): DerivedLevel {
  if (p.studyLevel === "Doctoral") return "Confident";
  if (p.studyLevel === "Master's") return "Some experience";
  return p.year <= 2 ? "Beginner" : "Some experience";
}

/**
 * Coerces anything previously saved in localStorage into a valid Profile.
 *
 * The shape has changed across versions: `language` became `languages`, `major`
 * was added, and the list of fields grew. A returning visitor still holds the
 * old shape, and reading `profile.languages.includes(...)` on it threw and left
 * them looking at a blank page. Every load goes through here so that can never
 * happen again, whatever is in storage.
 */
export function normaliseProfile(raw: unknown): Profile {
  const p = (raw ?? {}) as Record<string, unknown>;
  const d = DEFAULT_PROFILE;

  const str = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim() !== "" ? v : fallback;

  const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
    typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;

  // `language` (singular) is the pre-2026-08 shape.
  const rawLangs = Array.isArray(p.languages)
    ? p.languages
    : typeof p.language === "string"
      ? [p.language]
      : [];
  const languages = rawLangs.filter(
    (l): l is Language => typeof l === "string" && (LANGUAGES as readonly string[]).includes(l),
  );

  const year = Number(p.year);

  return {
    country: str(p.country, d.country),
    institution: str(p.institution, d.institution),
    field: oneOf(p.field, FIELDS, d.field),
    major: typeof p.major === "string" ? p.major : "",
    studyLevel: oneOf(p.studyLevel, STUDY_LEVELS, d.studyLevel),
    year: (YEARS as readonly number[]).includes(year) ? (year as Year) : d.year,
    goal: oneOf(p.goal, GOALS, d.goal),
    languages: languages.length > 0 ? languages : d.languages,
  };
}
