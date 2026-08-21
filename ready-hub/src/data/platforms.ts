export type Platform = {
  id: string;
  name: string;
  logo: string;   // vendored SVG in /public/platforms
  hex: string;    // official brand colour
  kind: "Course platform" | "Creative tool" | "Video" | "University";
  blurb: string;
};

export const PLATFORMS: Platform[] = [
  { id: "coursera", name: "Coursera", logo: "/platforms/coursera.svg", hex: "#0056D2", kind: "Course platform", blurb: "University and industry certificates." },
  { id: "udemy", name: "Udemy", logo: "/platforms/udemy.svg", hex: "#A435F0", kind: "Course platform", blurb: "Practical, job-shaped short courses." },
  { id: "canva", name: "Canva", logo: "/platforms/canva.svg", hex: "#00C4CC", kind: "Creative tool", blurb: "Design skills you can use the same day." },
  { id: "youtube", name: "YouTube", logo: "/platforms/youtube.svg", hex: "#FF0000", kind: "Video", blurb: "Free full-length lectures and walkthroughs." },
  { id: "edx", name: "edX", logo: "/platforms/edx.svg", hex: "#02262B", kind: "University", blurb: "Courses from universities worldwide." },
  { id: "freecodecamp", name: "freeCodeCamp", logo: "/platforms/freecodecamp.svg", hex: "#0A0A23", kind: "Course platform", blurb: "Free, project-led programming courses." },
  { id: "khanacademy", name: "Khan Academy", logo: "/platforms/khanacademy.svg", hex: "#14BF96", kind: "Course platform", blurb: "Foundations, taught slowly and clearly." },
  { id: "google", name: "Google", logo: "/platforms/google.svg", hex: "#4285F4", kind: "Course platform", blurb: "Career certificates in data and support." },
  { id: "udacity", name: "Udacity", logo: "/platforms/udacity.svg", hex: "#02B3E4", kind: "Course platform", blurb: "Reviewed projects and technical tracks." },
  { id: "datacamp", name: "DataCamp", logo: "/platforms/datacamp.svg", hex: "#03EF62", kind: "Course platform", blurb: "Data work in the browser, no setup." },
  { id: "figma", name: "Figma", logo: "/platforms/figma.svg", hex: "#F24E1E", kind: "Creative tool", blurb: "Interface design and prototyping." },
  { id: "skillshare", name: "Skillshare", logo: "/platforms/skillshare.svg", hex: "#00FF84", kind: "Creative tool", blurb: "Short creative classes with a final project." },
];

export const PLATFORM_BY_ID = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));
