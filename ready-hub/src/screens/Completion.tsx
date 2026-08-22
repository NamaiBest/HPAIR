import { motion } from "motion/react";
import {
  ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, ExternalLink, Globe2, Languages, Lock, Printer,
  Star, Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button, PlatformMark } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { PLATFORM_BY_ID } from "@/data/platforms";
import type { Ranked } from "@/lib/match";
import type { Profile } from "@/data/profile";
import { assessmentKind } from "@/data/assessments";
import { placementsFor } from "@/data/placements";


import { asset, formatDuration } from "@/lib/utils";

const EASTER_EGG_URL = "https://namaicv.com";

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

/** Shown on both certificates once the assessment has been passed. */
function ExamMark({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={
        dark
          ? "inline-flex items-center gap-1.5 rounded-full bg-leaf/20 px-2.5 py-1 text-[10.5px] font-semibold tracking-wide text-leaf uppercase"
          : "inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-2.5 py-1 text-[10.5px] font-semibold tracking-wide text-leaf-dim uppercase"
      }
    >
      <CheckCircle2 className="size-3" />
      Exam taken
    </span>
  );
}

export function Completion({
  course, profile, onBack, assessment, onTakeAssessment,
}: {
  course: Ranked;
  profile: Profile;
  onBack: () => void;
  /** Set once the learner has passed the course assessment. */
  assessment?: { score: number; percentile: number };
  onTakeAssessment: () => void;
}) {
  const passed = Boolean(assessment);
  const openings = (rung: string) =>
    rung === "inperson" || rung === "remote"
      ? placementsFor(rung, profile.country)
      : [];
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
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase opacity-45">
                <PlatformMark id={course.platformId} size={14} />
                {platform?.name} certificate
              </div>
              {passed && <ExamMark />}
            </div>
            <p className="mt-5 text-[13px] opacity-50">This certifies that</p>
            <p className="mt-1 font-display text-[22px] font-bold">A READY Hub learner</p>
            <p className="mt-3.5 text-[13px] opacity-50">completed</p>
            <p className="mt-1 text-[15px] font-semibold">{course.title}</p>
            <div className="mt-6 flex items-end justify-between border-t border-black/8 pt-4">
              <span className="text-[11.5px] opacity-45">{today}</span>
              <div className="flex items-end gap-3">
                <span className="font-mono text-[11px] opacity-35">
                  {platform?.name.toUpperCase().replace(/\s/g, "")}-{course.id.toUpperCase().slice(0, 6)}
                </span>
                <a href={EASTER_EGG_URL} target="_blank" rel="noopener noreferrer" title="Scan me 👀">
                  <QRCodeSVG value={EASTER_EGG_URL} size={44} level="L" bgColor="transparent" fgColor="#06272c" className="opacity-30 transition-opacity duration-200 hover:opacity-70" />
                </a>
              </div>
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
              {passed && <ExamMark dark />}
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
              {passed && (
                <div>
                  <p className="text-[11px] opacity-45">Exam</p>
                  <p className="mt-1 font-mono text-[13px] font-semibold text-leaf">
                    {assessment!.score}%
                  </p>
                </div>
              )}
            </div>
            <div className="relative mt-6 flex items-end justify-between border-t border-white/12 pt-4">
              <span className="text-[11.5px] opacity-45">{today}</span>
              <div className="flex items-end gap-3">
                <span className="font-mono text-[11px] opacity-35">
                  READY-{profile.country.slice(0, 2).toUpperCase()}-{course.id.toUpperCase().slice(0, 6)}
                </span>
                <a href={EASTER_EGG_URL} target="_blank" rel="noopener noreferrer" title="Scan me 👀">
                  <QRCodeSVG value={EASTER_EGG_URL} size={44} level="L" bgColor="transparent" fgColor="#ffffff" className="opacity-25 transition-opacity duration-200 hover:opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="mt-3 text-[11.5px] opacity-40">
          Two records: the platform confirms you finished the course, READY confirms it counted
          toward your track and at what standard.
        </p>

        {/* ── Assessment gate ──────────────────────────────────── */}
        {!passed && (
          <div className="mt-14 flex flex-wrap items-center gap-5 rounded-[20px] bg-ink p-7 text-white print:hidden">
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[12px] font-semibold">
                <Lock className="size-3.5" /> One step left
              </span>
              <h2 className="mt-4 text-[24px] leading-tight font-extrabold tracking-[-0.02em]">
                {assessmentKind(course.id) === "exam"
                  ? "Pass the assessment to open placements"
                  : "Submit your project to open placements"}
              </h2>
              <p className="mt-2.5 max-w-[54ch] text-[14px] leading-relaxed text-white/70">
                {assessmentKind(course.id) === "exam"
                  ? "Finishing the videos earns the certificate. The graded exam is what proves you can apply it, and it is what employers and placement partners actually look at."
                  : "Applied courses are marked on work. Your submission is graded against everyone in your cohort who answered the same brief."}
              </p>
            </div>
            <Button size="lg" onClick={onTakeAssessment} className="shrink-0">
              {assessmentKind(course.id) === "exam" ? "Take the assessment" : "Start the project"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Opportunity ladder ───────────────────────────────── */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em]">What opens up now</h2>
            <p className="mt-2 max-w-xl text-[14.5px] opacity-55">
              Every route below is real work with a named responsibility. None of them are waiting lists.
            </p>
          </div>
          {passed && (
            <span className="inline-flex items-center gap-2 rounded-full bg-leaf/15 px-3.5 py-2 text-[12.5px] font-semibold text-leaf-dim">
              <Check className="size-3.5" />
              Unlocked · {assessment!.score}% · top {assessment!.percentile + 1}%
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {RUNGS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.15 + i * 0.08 }}
              className={`relative overflow-hidden rounded-[18px] bg-white p-5 pl-6 shadow-[0_0_0_1px_rgb(6_39_44/0.07)] transition-[filter,opacity] duration-500 ${
                passed ? "" : "opacity-45 grayscale"
              }`}
              aria-disabled={!passed}
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

                  {passed && r.id !== "contributor" && openings(r.id).length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2">
                      {openings(r.id).map((o) => (
                        <li key={o.id}>
                          <a
                            href={o.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-[13px] bg-black/[0.035] px-3.5 py-3 transition-colors duration-150 hover:bg-black/[0.06]"
                          >
                            <span className="text-[13px] font-semibold">{o.title}</span>
                            <span className="text-[12px] opacity-55">{o.operator}</span>
                            <span className="ml-auto flex items-center gap-2 text-[11.5px] opacity-45">
                              {o.location} · {o.window}
                              <ExternalLink className="size-3" />
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

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
                <Button
                  variant={r.id === "contributor" ? "primary" : "outline"}
                  size="sm"
                  className="shrink-0 print:hidden"
                  disabled={!passed}
                >
                  {!passed ? (
                    <><Lock className="size-3.5" /> Locked</>
                  ) : r.id === "contributor" ? (
                    "Choose a role"
                  ) : (
                    `${openings(r.id).length} open now`
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {passed && (
          <p className="mt-5 text-[11.5px] leading-relaxed opacity-45">
            These programmes are run by the organisations named beside them. READY Hub routes
            qualifying learners to their application pages and is not affiliated with them.
          </p>
        )}

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

        <ClosingSlide />
      </div>
      <Footer className="print:hidden" />
    </div>
  );
}

/**
 * The closing slide. Team V13 built the whole of READY Hub inside 30 hours,
 * and this is the note the pitch ends on.
 */
function ClosingSlide() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", duration: 0.6, bounce: 0 }}
      className="relative mt-6 overflow-hidden rounded-[22px] bg-ink px-8 py-16 text-center text-white print:hidden sm:px-14 sm:py-20"
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, rgba(20,189,208,0.28) 0%, rgba(20,189,208,0) 55%)",
        }}
        aria-hidden
      />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 font-mono text-[12px] font-semibold tracking-wide uppercase">
          Built in 30 hours
        </span>
        <p className="mx-auto mt-7 max-w-[24ch] font-display text-[34px] leading-[1.08] font-extrabold tracking-[-0.025em] sm:text-[46px]">
          If we can do this in 30 hours, we bloody well can pull off any other shit you want us to.
        </p>
        <p className="mx-auto mt-6 max-w-[46ch] text-[14.5px] leading-relaxed text-white/60">
          Scoring engine, live re-ranking, six languages, real lectures, graded assessment,
          certificates and placement routing. Team V13.
        </p>
      </div>
    </motion.section>
  );
}
