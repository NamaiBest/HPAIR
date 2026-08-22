import { COURSES } from "./courses";

/**
 * How a course is assessed.
 *
 * Knowledge-led courses end in a graded exam. Applied and creative courses end
 * in a project that is marked against the rest of the cohort, because "did you
 * understand it" is the wrong question for a design brief.
 */
export type AssessmentKind = "exam" | "project";

export type ExamQuestion = {
  id: string;
  prompt: string;
  options: string[];
  /** Index of the correct option. Used to render the review, not to fake the score. */
  answer: number;
};

/** Creative and applied fields are marked on submitted work, not multiple choice. */
const PROJECT_FIELDS = new Set(["Arts & Humanities"]);
const PROJECT_PLATFORMS = new Set(["canva", "figma"]);

export function assessmentKind(courseId: string): AssessmentKind {
  const c = COURSES.find((x) => x.id === courseId);
  if (!c) return "exam";
  return PROJECT_FIELDS.has(c.field) || PROJECT_PLATFORMS.has(c.platformId) ? "project" : "exam";
}

/** A short, generic exam. Real deployments would carry a per-course bank. */
export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: "q1",
    prompt: "You have a spreadsheet where one column holds dates stored as text. What is the first thing to do before analysing it?",
    options: [
      "Sort the column alphabetically",
      "Convert the column to a real date type",
      "Delete the rows that look wrong",
      "Copy it into a new sheet",
    ],
    answer: 1,
  },
  {
    id: "q2",
    prompt: "A colleague sends you a chart where the vertical axis starts at 80 rather than 0. What is the honest concern?",
    options: [
      "Charts must always start at zero",
      "It exaggerates small differences between bars",
      "The colours will be misread",
      "There is no concern",
    ],
    answer: 1,
  },
  {
    id: "q3",
    prompt: "You are asked to summarise 40,000 rows for a manager who has five minutes. What do you lead with?",
    options: [
      "The full table, so nothing is hidden",
      "The method you used",
      "The one number that answers their question, then the caveat",
      "A list of every column name",
    ],
    answer: 2,
  },
  {
    id: "q4",
    prompt: "Your analysis depends on a file a teammate updates weekly. What makes the work reproducible?",
    options: [
      "Saving a copy on your desktop",
      "Recording the steps and the file version you used",
      "Emailing yourself the results",
      "Redoing it from memory each week",
    ],
    answer: 1,
  },
  {
    id: "q5",
    prompt: "Two variables move together in your data. What can you conclude?",
    options: [
      "One causes the other",
      "They are related; cause needs more evidence",
      "The data is wrong",
      "Nothing can ever be concluded",
    ],
    answer: 1,
  },
];

export type ProjectBrief = { title: string; body: string; deliverables: string[] };

export const PROJECT_BRIEF: ProjectBrief = {
  title: "Cohort project",
  body:
    "Applied courses are marked on work, not recall. Submit one piece made with what the course taught. Your cohort submits against the same brief in the same window, and marks are set relative to that cohort rather than against a fixed pass mark.",
  deliverables: [
    "One finished piece, exported at delivery quality",
    "A short note on who it is for and the decision you made",
    "The source file, so the work can be checked",
  ],
};

/**
 * MVP grading. A real build marks the submitted answers and, for projects,
 * the cohort's relative distribution. This demo returns a fixed strong result
 * so the opportunity ladder can be shown unlocked in a pitch.
 */
export const DEMO_RESULT = { score: 92, percentile: 4 };
