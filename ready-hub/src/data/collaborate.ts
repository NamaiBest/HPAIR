/**
 * Dummy seed content for the Collaborate hub: cross-discipline project
 * pitches, each needing roles the founder's own field doesn't cover.
 */
export type RoleSlot = { role: string; filled: boolean };

export type Pitch = {
  id: string;
  title: string;
  founder: string;
  founderField: string;
  pitch: string;
  roles: RoleSlot[];
  tag: string;
};

export const PITCHES: Pitch[] = [
  {
    id: "p1",
    title: "Micro-lending app for street vendors",
    founder: "Trang Nguyen",
    founderField: "Business",
    pitch:
      "A commerce backbone for small loans between vendors who already trust each other, without a bank in the middle. I've mapped the business model and the repayment logic. I cannot build the thing.",
    roles: [
      { role: "Backend engineer", filled: true },
      { role: "ML engineer, for repayment risk scoring", filled: false },
      { role: "UI/UX designer", filled: false },
    ],
    tag: "Fintech",
  },
  {
    id: "p2",
    title: "Low-cost soil moisture sensor for smallholder farms",
    founder: "Bounthavy Sisavath",
    founderField: "Agriculture",
    pitch:
      "I know exactly what data a farmer needs and when. I don't know how to get a $4 sensor talking to a phone.",
    roles: [
      { role: "Hardware / embedded engineer", filled: false },
      { role: "Mobile developer", filled: false },
      { role: "Data analyst", filled: true },
    ],
    tag: "AgriTech",
  },
  {
    id: "p3",
    title: "Bilingual mental-health check-in bot for students",
    founder: "Kanya Phetchara",
    founderField: "Social Sciences",
    pitch:
      "Built the conversation flow and the escalation logic with input from a counsellor. Need it actually built, and need the Vietnamese and Khmer wording checked by native speakers, not translated by me.",
    roles: [
      { role: "NLP / ML engineer", filled: false },
      { role: "Vietnamese content reviewer", filled: true },
      { role: "Khmer content reviewer", filled: false },
    ],
    tag: "HealthTech",
  },
  {
    id: "p4",
    title: "Explainer video series for first-generation university applicants",
    founder: "Rithy Chan",
    founderField: "Education",
    pitch:
      "Scripts are done for six videos on how financial aid actually works. Need someone who can shoot and edit, and someone who can design the on-screen graphics so they don't look like a school project.",
    roles: [
      { role: "Video editor", filled: false },
      { role: "Motion / graphic designer", filled: false },
      { role: "Scriptwriter", filled: true },
    ],
    tag: "EdTech",
  },
];
