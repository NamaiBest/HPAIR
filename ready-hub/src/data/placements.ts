/**
 * Real, externally run programmes that READY Hub points learners toward.
 *
 * Every entry below is an actual open programme operated by the named body.
 * READY Hub does not run them and is not affiliated with them: it routes
 * qualifying learners to the application page, which is why each carries the
 * operator's name and its own link.
 *
 * Checked August 2026. Programme cycles change, so treat `window` as
 * indicative and let the link be the source of truth.
 */
export type Placement = {
  id: string;
  kind: "inperson" | "remote";
  title: string;
  operator: string;
  countries: string[];
  location: string;
  window: string;
  url: string;
};

export const PLACEMENTS: Placement[] = [
  // ── In person ───────────────────────────────────────────────
  {
    id: "aun",
    kind: "inperson",
    title: "AUN Internship Programme",
    operator: "ASEAN University Network Secretariat",
    countries: ["Vietnam", "Laos", "Cambodia", "Thailand", "Myanmar"],
    location: "Bangkok, Thailand",
    window: "Rolling intake",
    url: "https://www.aunsec.org/aun-action/aun-internship-programme-2026",
  },
  {
    id: "unesco-bkk",
    kind: "inperson",
    title: "UNESCO Regional Office Internship",
    operator: "UNESCO Bangkok",
    countries: ["Vietnam", "Laos", "Cambodia", "Thailand", "Myanmar"],
    location: "Bangkok, Thailand",
    window: "Cycles through the year",
    url: "https://www.unesco.org/en/fieldoffice/bangkok/careers",
  },
  {
    id: "undp-vn",
    kind: "inperson",
    title: "UNDP Viet Nam Internship",
    operator: "United Nations Development Programme",
    countries: ["Vietnam"],
    location: "Hanoi, Vietnam",
    window: "Posted per vacancy",
    url: "https://unjobs.org/offices/undp_han?theme=internship",
  },
  {
    id: "fnsip-kh",
    kind: "inperson",
    title: "Foreign National Student Intern Program",
    operator: "U.S. Embassy Phnom Penh",
    countries: ["Cambodia"],
    location: "Phnom Penh, Cambodia",
    window: "Summer cycle",
    url: "https://kh.usembassy.gov/foreign-national-student-intern-program-fnsip-cambodian-student-internship/",
  },
  {
    id: "rok-mekong",
    kind: "inperson",
    title: "ROK Mekong Youth Group Workshop",
    operator: "Embassy of the Republic of Korea",
    countries: ["Vietnam", "Laos", "Cambodia", "Thailand", "Myanmar"],
    location: "Republic of Korea",
    window: "Annual call",
    url: "https://www.mofa.go.kr/kh-en/brd/m_25856/view.do?seq=94",
  },

  // ── Remote ──────────────────────────────────────────────────
  {
    id: "unfpa",
    kind: "remote",
    title: "Adolescent and Youth Programme Internship",
    operator: "United Nations Population Fund",
    countries: ["Vietnam", "Laos", "Cambodia", "Thailand", "Myanmar"],
    location: "Remote",
    window: "Rolling intake",
    url: "https://www.unfpa.org/jobs/international-intern-adolescent-and-youth-ay-programme",
  },
  {
    id: "mekong-institute",
    kind: "remote",
    title: "Mekong Institute Young Researcher Programmes",
    operator: "Mekong Institute",
    countries: ["Vietnam", "Laos", "Cambodia", "Thailand", "Myanmar"],
    location: "Remote, with Khon Kaen sessions",
    window: "By project call",
    url: "https://mekonginstitute.org/",
  },
  {
    id: "mkcf",
    kind: "remote",
    title: "Mekong ROK Cooperation Fund projects",
    operator: "Mekong Institute and the Republic of Korea",
    countries: ["Vietnam", "Laos", "Cambodia", "Thailand", "Myanmar"],
    location: "Remote across the five countries",
    window: "Open calls",
    url: "https://mekongrokcf.org/",
  },
  {
    id: "ohchr-kh",
    kind: "remote",
    title: "OHCHR Cambodia Internship",
    operator: "UN Human Rights Office",
    countries: ["Cambodia"],
    location: "Remote or Phnom Penh",
    window: "Rolling intake",
    url: "https://cambodia.ohchr.org/en/internship-program",
  },
];

/** Programmes a learner in this country can actually apply to. */
export function placementsFor(kind: Placement["kind"], country: string): Placement[] {
  return PLACEMENTS.filter((p) => p.kind === kind && p.countries.includes(country));
}
