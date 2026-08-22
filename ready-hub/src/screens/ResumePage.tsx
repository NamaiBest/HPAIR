import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Copy, Printer } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { FACTOR_KEYS, FACTOR_META } from "@/lib/score";
import { useT } from "@/lib/i18n";
import type { Ranked } from "@/lib/match";
import type { Profile } from "@/data/profile";

export function ResumePage({
  profile, completedCourses, assessments, onBack, onHome,
}: {
  profile: Profile;
  completedCourses: Ranked[];
  assessments: Record<string, { score: number; percentile: number }>;
  onBack: () => void;
  onHome: () => void;
}) {
  const { t } = useT();
  const [copied, setCopied] = useState(false);

  // The factors most represented across whatever the learner has actually
  // finished, so "skills demonstrated" reflects real completions.
  const skillTotals: Record<string, number> = {};
  for (const c of completedCourses) {
    for (const k of FACTOR_KEYS) skillTotals[k] = (skillTotals[k] ?? 0) + c.factors[k];
  }
  const topSkills = FACTOR_KEYS.slice().sort((a, b) => (skillTotals[b] ?? 0) - (skillTotals[a] ?? 0));

  const copyLink = async () => {
    const fakeUrl = `https://readyhub.example/r/${profile.country.slice(0, 2).toLowerCase()}-${profile.field.replace(/\s/g, "").toLowerCase()}`;
    try {
      await navigator.clipboard.writeText(fakeUrl);
    } catch {
      /* clipboard blocked; the button still gives visible feedback */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-paper/85 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-[760px] items-center gap-3 px-5 py-3.5">
          <Brand onHome={onHome} />
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onBack}>
            <ArrowLeft className="size-4" /> {t("nav.home")}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-[30px] font-extrabold tracking-[-0.02em]">{t("rs.title")}</h1>
            <p className="mt-2 max-w-[54ch] text-[14.5px] leading-relaxed opacity-55">{t("rs.sub")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="size-3.5" /> {copied ? t("rs.copied") : t("rs.copyLink")}
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-3.5" /> {t("rs.download")}
            </Button>
          </div>
        </div>

        {/* The resume itself */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="mt-8 overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_1px_rgb(6_39_44/0.08)] print:shadow-none"
        >
          <div className="bg-ink p-7 text-white">
            <p className="text-[11px] tracking-[0.14em] uppercase opacity-50">{t("rs.learner")}</p>
            <h2 className="mt-2 font-display text-[24px] font-extrabold">{profile.institution}</h2>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/70">
              <span>{profile.field}{profile.major ? ` · ${profile.major}` : ""}</span>
              <span>{profile.country}</span>
              <span>{profile.studyLevel}, year {profile.year}</span>
              <span>{profile.languages.join(", ")}</span>
            </div>
          </div>

          <div className="p-7">
            <p className="text-[12px] font-semibold tracking-wide opacity-50 uppercase">{t("rs.verifiedLearning")}</p>

            {completedCourses.length === 0 ? (
              <p className="mt-3 text-[13.5px] leading-relaxed opacity-55">{t("rs.noCourses")}</p>
            ) : (
              <div className="mt-3 flex flex-col gap-2.5">
                {completedCourses.map((c) => {
                  const a = assessments[c.id];
                  return (
                    <div key={c.id} className="flex items-center justify-between gap-3 rounded-[12px] bg-black/[0.03] px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold">{c.title}</p>
                        <p className="text-[11.5px] opacity-50">{c.field} · {c.level}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-mono text-[13px] font-bold text-flow">{c.score}/10</span>
                        {a && (
                          <span className="flex items-center gap-1 rounded-full bg-leaf/15 px-2 py-1 text-[10.5px] font-semibold text-leaf-dim">
                            <CheckCircle2 className="size-3" /> {t("rs.examTaken")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {completedCourses.length > 0 && (
              <>
                <p className="mt-7 text-[12px] font-semibold tracking-wide opacity-50 uppercase">{t("rs.skills")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topSkills.map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
                      style={{ background: `${FACTOR_META[k].color}1a`, color: FACTOR_META[k].color }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: FACTOR_META[k].color }} aria-hidden />
                      {FACTOR_META[k].label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        <p className="mt-6 text-center text-[11.5px] opacity-40 print:hidden">{t("rs.dummyNote")}</p>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
