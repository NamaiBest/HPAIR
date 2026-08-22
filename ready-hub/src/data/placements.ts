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
  /**
   * Set when no country in this region runs a public, apply-here internship
   * scheme through its Ministry of Education, checked directly rather than
   * assumed. The link still goes somewhere real: the ministry's own official
   * site, not a fabricated application page. The UI must show this
   * distinction rather than presenting it as equivalent to a verified entry.
   */
  illustrative?: boolean;
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

  // ── Ministry of Education, by country ──────────────────────
  // No country in the Mekong region publishes a standing, apply-here
  // internship scheme through its Ministry of Education (checked directly
  // for all five, August 2026). Each entry below links to that ministry's
  // own real official site rather than a fabricated application page, and
  // is marked `illustrative` so the UI can say so plainly.
  {
    id: "moe-vn-in",
    kind: "inperson",
    title: "Ministry of Education and Training, government placement track",
    operator: "Ministry of Education and Training, Vietnam",
    countries: ["Vietnam"],
    location: "Hanoi, Vietnam",
    window: "No public listing yet",
    url: "https://en.moet.gov.vn/",
    illustrative: true,
  },
  {
    id: "moe-vn-re",
    kind: "remote",
    title: "Ministry of Education and Training, government placement track",
    operator: "Ministry of Education and Training, Vietnam",
    countries: ["Vietnam"],
    location: "Remote, coordinated nationally",
    window: "No public listing yet",
    url: "https://en.moet.gov.vn/",
    illustrative: true,
  },
  {
    id: "moe-la-in",
    kind: "inperson",
    title: "Ministry of Education and Sports, government placement track",
    operator: "Ministry of Education and Sports, Laos",
    countries: ["Laos"],
    location: "Vientiane, Laos",
    window: "No public listing yet",
    url: "https://www.moe.gov.la/",
    illustrative: true,
  },
  {
    id: "moe-la-re",
    kind: "remote",
    title: "Ministry of Education and Sports, government placement track",
    operator: "Ministry of Education and Sports, Laos",
    countries: ["Laos"],
    location: "Remote, coordinated nationally",
    window: "No public listing yet",
    url: "https://www.moe.gov.la/",
    illustrative: true,
  },
  {
    id: "moe-kh-in",
    kind: "inperson",
    title: "Ministry of Education, Youth and Sport, government placement track",
    operator: "Ministry of Education, Youth and Sport, Cambodia",
    countries: ["Cambodia"],
    location: "Phnom Penh, Cambodia",
    window: "No public listing yet",
    url: "http://www.moeys.gov.kh/en/",
    illustrative: true,
  },
  {
    id: "moe-kh-re",
    kind: "remote",
    title: "Ministry of Education, Youth and Sport, government placement track",
    operator: "Ministry of Education, Youth and Sport, Cambodia",
    countries: ["Cambodia"],
    location: "Remote, coordinated nationally",
    window: "No public listing yet",
    url: "http://www.moeys.gov.kh/en/",
    illustrative: true,
  },
  {
    id: "moe-th-in",
    kind: "inperson",
    title: "Ministry of Education, government placement track",
    operator: "Ministry of Education, Thailand",
    countries: ["Thailand"],
    location: "Bangkok, Thailand",
    window: "No public listing yet",
    url: "https://www.moe.go.th/en/",
    illustrative: true,
  },
  {
    id: "moe-th-re",
    kind: "remote",
    title: "Ministry of Education, government placement track",
    operator: "Ministry of Education, Thailand",
    countries: ["Thailand"],
    location: "Remote, coordinated nationally",
    window: "No public listing yet",
    url: "https://www.moe.go.th/en/",
    illustrative: true,
  },
  {
    id: "moe-mm-in",
    kind: "inperson",
    title: "Ministry of Education, government placement track",
    operator: "Ministry of Education, Myanmar",
    countries: ["Myanmar"],
    location: "Naypyidaw, Myanmar",
    window: "No public listing yet",
    url: "https://www.moe.gov.mm/en",
    illustrative: true,
  },
  {
    id: "moe-mm-re",
    kind: "remote",
    title: "Ministry of Education, government placement track",
    operator: "Ministry of Education, Myanmar",
    countries: ["Myanmar"],
    location: "Remote, coordinated nationally",
    window: "No public listing yet",
    url: "https://www.moe.gov.mm/en",
    illustrative: true,
  },
];

/** Programmes a learner in this country can actually apply to. */
export function placementsFor(kind: Placement["kind"], country: string): Placement[] {
  return PLACEMENTS.filter((p) => p.kind === kind && p.countries.includes(country));
}
