export type Stat = { value: string; label: string; source: string };

/** Figures from the READY case materials. Each one is shown with its source. */
export const CASE_STATS: Stat[] = [
  {
    value: "17%",
    label: "of people in Vietnam have basic ICT skills. Cambodia is 29%, Thailand 17%.",
    source: "ASEAN Post-COVID Digital Policy Priorities, 2023",
  },
  {
    value: "7×",
    label: "Young people in Southeast Asia are around seven times more likely to be jobless than adults.",
    source: "ILO, Global Employment Trends for Youth 2026",
  },
  {
    value: "15%",
    label: "of Vietnamese graduates were rated excellent on AI readiness by employers, against 52% who rated themselves so.",
    source: "Pearson & AWS AI Readiness Report, 2026",
  },
  {
    value: "80%",
    label: "of Southeast Asian jobs will require basic digital skills by 2030.",
    source: "UNICEF, 2023",
  },
];

export const ORG = {
  scholarships: "6,625",
  disbursed: "$1.2M",
  since: "2002",
  countriesLive: 3,
  funding: "$500K through 2029",
};
