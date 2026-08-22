export type Country = { id: string; name: string; nameVi: string; status: "live" | "expanding" };

export const COUNTRIES: Country[] = [
  { id: "vn", name: "Vietnam", nameVi: "Việt Nam", status: "live" },
  { id: "la", name: "Laos", nameVi: "Lào", status: "live" },
  { id: "kh", name: "Cambodia", nameVi: "Campuchia", status: "live" },
  { id: "th", name: "Thailand", nameVi: "Thái Lan", status: "expanding" },
  { id: "mm", name: "Myanmar", nameVi: "Myanmar", status: "expanding" },
];

/** Real universities, grouped by country. Used to populate the picker. */
export const UNIVERSITIES: Record<string, string[]> = {
  Vietnam: [
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
  "Finance",
  "Engineering",
  "Social Sciences",
  "Agriculture",
  "Business",
  "Arts & Humanities",
  "Computer Science",
] as const;
export type Field = (typeof FIELDS)[number];

export const FIELD_VI: Record<Field, string> = {
  Finance: "Tài chính",
  Engineering: "Kỹ thuật",
  "Social Sciences": "Khoa học xã hội",
  Agriculture: "Nông nghiệp",
  Business: "Kinh doanh",
  "Arts & Humanities": "Nghệ thuật & Nhân văn",
  "Computer Science": "Khoa học máy tính",
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
  field: Field;
  studyLevel: StudyLevel;
  year: Year;
  goal: Goal;
  language: Language;
};

export const DEFAULT_PROFILE: Profile = {
  country: "Vietnam",
  institution: "Can Tho University",
  field: "Finance",
  studyLevel: "Undergraduate",
  year: 2,
  goal: "Move into a technical role",
  language: "Vietnamese",
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
