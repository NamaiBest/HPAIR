import { motion } from "motion/react";
import {
  ArrowLeft, Building2, Check, Globe2, Languages, Printer,
  Star, Users,
} from "lucide-react";
import { Button, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { PLATFORM_BY_ID } from "@/data/platforms";
import type { Ranked } from "@/lib/match";
import type { Profile } from "@/data/profile";
import { asset, formatDuration } from "@/lib/utils";

const RUNGS = [
  {
    id: "inperson",
    icon: Building2,
    tier: "In-person placement",
    who: "Offered to top performers",
    body: "A funded placement with a partner organisation, or with VietHope directly in Ho Chi Minh City or Hue.",
    accent: "#14bdd0",
  },
  {
    id: "remote",
    icon: Globe2,
    tier: "Remote placement",
    who: "Offered to strong performers",
    body: "The same work, from where you already are. Built for learners holding a job or caring for family, and paid on the same terms.",
    accent: "#008081",
  },
  {
    id: "contributor",
    icon: Users,
    tier: "Contributor roles",
    who: "Open to everyone who finishes",
    body: "Where most of READY's capacity comes from. Choose one, or several.",
    accent: "#9dc73c",
    roles: [
      { icon: Languages, name: "Localisation contributor", note: "Subtitle this course into your language for the learners behind you." },
      { icon: Star, name: "Course reviewer", note: "Your rating feeds directly into the READY Score other learners see." },
      { icon: Users, name: "Cohort facilitator", note: "Run a weekly session for a group at your university." },
      { icon: Globe2, name: "Alumni network", note: "Stay reachable for the people arriving next year." },
    ],
  },
];

export function Completion({
  course, profile, onBack,
}: {
  course: Ranked;
  profile: Profile;
  onBack: () => void;
}) {
  const platform = PLATFORM_BY_ID[course.platformId];
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-paper/85 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-5 py-3 lg:px-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="size-4" /> Catalogue
          </Button>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => window.print()}>
            <Printer className="size-4" /> Print or save as PDF
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-5 py-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-leaf/15 px-3 py-1.5 text-[12.5px] font-semibold text-leaf-dim">
            <Check className="size-3.5" /> Course complete
          </span>
          <h1 className="mt-4 max-w-2xl text-[38px] leading-[1.08] font-extrabold tracking-[-0.025em]">
            You finished {course.title}.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed opacity-60">
            That is {formatDuration(course.minutes)} of work done. Here is what it is worth,
            and what you can do with it next.
          </p>
        </motion.div>

        {/* ── Dual certificate ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.1 }}
          className="mt-9 grid gap-4 sm:grid-cols-2"
        >
          {/* Platform certificate */}
          <div className="rounded-[18px] bg-white p-6 shadow-[0_0_0_1px_rgb(6_39_44/0.08)]">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase opacity-45">
              <PlatformMark id={course.platformId} size={14} />
              {platform?.name} certificate
            </div>
            <p className="mt-5 text-[13px] opacity-50">This certifies that</p>
            <p className="mt-1 font-display text-[22px] font-bold">A READY Hub learner</p>
            <p className="mt-3.5 text-[13px] opacity-50">completed</p>
            <p className="mt-1 text-[15px] font-semibold">{course.title}</p>
            <div className="mt-6 flex items-end justify-between border-t border-black/8 pt-4">
              <span className="text-[11.5px] opacity-45">{today}</span>
              <span className="font-mono text-[11px] opacity-35">
                {platform?.name.toUpperCase().replace(/\s/g, "")}-{course.id.toUpperCase().slice(0, 6)}
              </span>
            </div>
          </div>

          {/* READY certificate */}
          <div className="relative overflow-hidden rounded-[18px] bg-ink p-6 text-white">
            <img
              src={asset("/viethope/leaf.png")} alt=""
              className="pointer-events-none absolute -top-6 -right-8 w-40 opacity-[0.12]"
              style={{ outline: "none" }}
            />
            <div className="relative flex items-center gap-2.5">
              <img
                src={asset("/viethope/viethope-logo.png")} alt="VietHope"
                className="h-7 w-auto"
                style={{ outline: "none", filter: "brightness(0) invert(1)" }}
              />
              <span className="h-5 w-px bg-white/25" />
              <span className="text-[11px] tracking-[0.14em] uppercase opacity-60">
                READY verification
              </span>
            </div>
            <p className="relative mt-5 text-[13px] opacity-50">Verified completion for</p>
            <p className="relative mt-1 font-display text-[22px] font-bold">
              {profile.institution || "A Mekong region learner"}
            </p>
            <div className="relative mt-4 flex flex-wrap gap-x-6 gap-y-3">
              <div>
                <p className="text-[11px] opacity-45">READY Score</p>
                <p className="font-mono text-2xl font-semibold">{course.score.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-[11px] opacity-45">Field</p>
                <p className="mt-1 text-[13px] font-medium">{profile.field}</p>
              </div>
              <div>
                <p className="text-[11px] opacity-45">Country</p>
                <p className="mt-1 text-[13px] font-medium">{profile.country}</p>
              </div>
            </div>
            <div className="relative mt-6 flex items-end justify-between border-t border-white/12 pt-4">
              <span className="text-[11.5px] opacity-45">{today}</span>
              <span className="font-mono text-[11px] opacity-35">
                READY-{profile.country.slice(0, 2).toUpperCase()}-{course.id.toUpperCase().slice(0, 6)}
              </span>
            </div>
          </div>
        </motion.div>
        <p className="mt-3 text-[11.5px] opacity-40">
          Two records: the platform confirms you finished the course, READY confirms it counted
          toward your track and at what standard.
        </p>

        {/* ── Opportunity ladder ───────────────────────────────── */}
        <h2 className="mt-14 text-[26px] font-extrabold tracking-[-0.02em]">What opens up now</h2>
        <p className="mt-2 max-w-xl text-[14.5px] opacity-55">
          Every route below is real work with a named responsibility. None of them are waiting lists.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {RUNGS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.15 + i * 0.08 }}
              className="relative overflow-hidden rounded-[18px] bg-white p-5 pl-6 shadow-[0_0_0_1px_rgb(6_39_44/0.07)]"
            >
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1" style={{ background: r.accent }} aria-hidden />
              <div className="flex flex-wrap items-start gap-4">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-[13px]"
                  style={{ background: `${r.accent}1f`, color: r.accent }}
                >
                  <r.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-[17px] font-bold tracking-[-0.01em]">{r.tier}</h3>
                    <span className="text-[12px] opacity-50">{r.who}</span>
                  </div>
                  <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed opacity-65">{r.body}</p>

                  {r.roles && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {r.roles.map((role) => (
                        <div key={role.name} className="rounded-[13px] bg-black/[0.035] p-3.5">
                          <p className="flex items-center gap-2 text-[13px] font-semibold">
                            <role.icon className="size-3.5 shrink-0 opacity-55" />
                            {role.name}
                          </p>
                          <p className="mt-1 text-[12px] leading-snug opacity-55">{role.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant={r.id === "contributor" ? "primary" : "outline"} size="sm" className="shrink-0 print:hidden">
                  {r.id === "contributor" ? "Choose a role" : "See openings"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-[18px] bg-ink p-7 text-white">
          <p className="max-w-2xl text-[15px] leading-relaxed">
            Most learners will not take a placement, and that was never the point. The people who
            subtitle a course, review one, or run a session for their cohort are how READY reaches
            the next intake at all.
          </p>
          <Button variant="primary" className="mt-5 print:hidden" onClick={onBack}>
            Back to my courses
          </Button>
        </div>
      </div>
      <Footer className="print:hidden" />
    </div>
  );
}
