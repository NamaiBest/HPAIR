/**
 * Dummy seed content for the Community forum.
 *
 * This is mocked, not live data. It exists to show the shape of the idea:
 * a learner asks something real, an employer answers with a specific
 * course, and following that course is what opens the door. Two threads
 * below spell that loop out explicitly.
 */
export type Role = "Student" | "Employer" | "Alumni";

export type Reply = {
  id: string;
  author: string;
  role: Role;
  body: string;
  /** Set when this reply is the one that names a course to take. */
  recommendsCourseId?: string;
  upvotes: number;
};

export type Thread = {
  id: string;
  author: string;
  role: Role;
  field: string;
  title: string;
  body: string;
  upvotes: number;
  replies: Reply[];
};

export const THREADS: Thread[] = [
  {
    id: "t1",
    author: "Minh T.",
    role: "Student",
    field: "Finance",
    title: "How do I move from a finance degree into a data-facing role?",
    body:
      "I'm two years into a finance degree and keep seeing 'data analyst' roles that want Excel and SQL. I have neither. Where do I actually start, and does anyone hire without a CS background?",
    upvotes: 34,
    replies: [
      {
        id: "r1",
        author: "Hoang Vu",
        role: "Employer",
        body:
          "Senior Analyst at a regional fintech here. We hire finance grads over CS grads for this specific role more often than you'd think, because you already understand what the numbers mean. Start with Excel for Financial Analysis, then SQL for Business Reporting. Candidates who show both certificates skip our screening call and go straight to a first interview.",
        recommendsCourseId: "excel-finance",
        upvotes: 41,
      },
      {
        id: "r2",
        author: "Minh T.",
        role: "Student",
        body: "That's genuinely useful, thank you. Starting the Excel course tonight.",
        upvotes: 6,
      },
    ],
  },
  {
    id: "t2",
    author: "Sopheak K.",
    role: "Student",
    field: "Arts & Humanities",
    title: "Do employers actually care about a Canva portfolio, or do I need Adobe?",
    body:
      "Everyone in my design classes talks about Adobe. I can't afford it and Canva feels like it's seen as the 'not serious' option. Is that actually true where you work?",
    upvotes: 27,
    replies: [
      {
        id: "r3",
        author: "Lena Aguilar",
        role: "Employer",
        body:
          "Brand lead at a consumer app here. What we actually look at is whether the work is clean and whether you can explain the decision behind it, not the tool. Design That Looks Professional, in Canva plus a two-line rationale on each piece gets you further than a messy Adobe file. We've fast-tracked two of our current freelancers straight from that exact combination into paid placements.",
        recommendsCourseId: "canva-design",
        upvotes: 52,
      },
    ],
  },
  {
    id: "t3",
    author: "Bounthavy S.",
    role: "Student",
    field: "Agriculture",
    title: "Is it worth learning Python if my degree is agriculture, not CS?",
    body:
      "I collect a lot of field data by hand and it takes forever to make sense of it. Someone told me Python would help but it feels like a huge detour from my actual degree.",
    upvotes: 19,
    replies: [
      {
        id: "r4",
        author: "Anh Pham",
        role: "Alumni",
        body:
          "I was in the same spot three years ago. Working With Field Data in Python is built for exactly this, not general programming. It took me a weekend, not a semester, and it's the reason my final year project didn't take me four months to write up.",
        recommendsCourseId: "pandas-field",
        upvotes: 22,
      },
    ],
  },
  {
    id: "t4",
    author: "Kanya P.",
    role: "Student",
    field: "Social Sciences",
    title: "How much does a placement actually pay for a remote role?",
    body:
      "I keep hearing 'paid on the same terms' but nobody says what that means. Roughly what should I expect for a first remote placement in this region?",
    upvotes: 15,
    replies: [
      {
        id: "r5",
        author: "David Osei",
        role: "Employer",
        body:
          "It varies by organisation and country, but 'same terms' means the same day rate as the in-person track for the same responsibility level, not a discounted remote rate. Ask directly on the application page, every listed programme states it.",
        upvotes: 18,
      },
    ],
  },
];
